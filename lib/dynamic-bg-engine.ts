import {
  formatRgbString,
  lerpRgbString,
  parseRgbString,
  rgbDistance,
  softenRgb,
} from "@/lib/color-utils";

const DEFAULT_RGB = "248,248,248";
const FEED_ANIMATION_MS = 1400;
const POSE_ANIMATION_MS = 1200;
const MIN_COLOR_DELTA = 2;
const SCROLL_SETTLE_MS = 120;
const SCROLLING_PICK_DELAY_MS = 160;
const IDLE_PICK_DELAY_MS = 50;

type CardReport = {
  rgb: string;
  element: Element;
  bandWeight: number;
  nearWeight: number;
};

class DynamicBgEngine {
  private cards = new Map<string, CardReport>();
  private displayRgb = DEFAULT_RGB;
  private targetRgb = DEFAULT_RGB;
  private subscribers = new Set<(rgb: string) => void>();
  private pickTimer: number | null = null;
  private rafId: number | null = null;
  private animFrom = DEFAULT_RGB;
  private animTo = DEFAULT_RGB;
  private animStart = 0;
  private animDuration = FEED_ANIMATION_MS;
  private scrolling = false;
  private scrollTimer: number | null = null;
  private scrollListenerAttached = false;

  private ensureScrollListener() {
    if (this.scrollListenerAttached || typeof window === "undefined") return;
    this.scrollListenerAttached = true;

    window.addEventListener(
      "scroll",
      () => {
        this.scrolling = true;
        this.refreshCardWeights();
        if (this.scrollTimer) window.clearTimeout(this.scrollTimer);
        this.scrollTimer = window.setTimeout(() => {
          this.scrolling = false;
          this.refreshCardWeights();
          this.schedulePick(0);
        }, SCROLL_SETTLE_MS);
        this.schedulePick();
      },
      { passive: true }
    );
  }

  private notify() {
    for (const listener of this.subscribers) {
      listener(this.displayRgb);
    }
  }

  private schedulePick(delayOverride?: number) {
    if (this.pickTimer) window.clearTimeout(this.pickTimer);
    const delay =
      delayOverride ??
      (this.scrolling ? SCROLLING_PICK_DELAY_MS : IDLE_PICK_DELAY_MS);
    this.pickTimer = window.setTimeout(() => this.pickTarget(), delay);
  }

  private computeBandWeight(rect: DOMRectReadOnly, viewportHeight: number) {
    const bandTop = viewportHeight * 0.34;
    const bandBottom = viewportHeight * 0.66;
    const overlapTop = Math.max(rect.top, bandTop);
    const overlapBottom = Math.min(rect.bottom, bandBottom);
    const overlap = Math.max(0, overlapBottom - overlapTop);
    if (overlap <= 0) return 0;

    const bandHeight = bandBottom - bandTop;
    return Math.min(1, overlap / (bandHeight * 0.45));
  }

  private computeNearWeight(rect: DOMRectReadOnly, viewportHeight: number) {
    const bandCenter = viewportHeight * 0.5;
    const cardCenter = rect.top + rect.height / 2;
    const distance = Math.abs(cardCenter - bandCenter);
    const sigma = viewportHeight * 0.3;
    return Math.exp(-0.5 * (distance / sigma) ** 2);
  }

  private getVisibility(rect: DOMRectReadOnly, viewportHeight: number) {
    const visibleHeight =
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    if (visibleHeight <= 0 || rect.height <= 0) return 0;
    return Math.min(1, visibleHeight / rect.height);
  }

  private refreshCardWeights() {
    const viewportHeight = window.innerHeight || 1;

    for (const [id, card] of this.cards) {
      const rect = card.element.getBoundingClientRect();
      const visibility = this.getVisibility(rect, viewportHeight);

      if (visibility < 0.08) {
        this.cards.delete(id);
        continue;
      }

      card.bandWeight = this.computeBandWeight(rect, viewportHeight) * visibility;
      card.nearWeight = this.computeNearWeight(rect, viewportHeight) * visibility;
    }
  }

  private blendCardColors(cards: CardReport[], mode: "band" | "near") {
    let totalWeight = 0;
    let r = 0;
    let g = 0;
    let b = 0;

    for (const card of cards) {
      const weight = mode === "band" ? card.bandWeight : card.nearWeight;
      if (weight <= 0) continue;
      const [cr, cg, cb] = parseRgbString(card.rgb);
      totalWeight += weight;
      r += cr * weight;
      g += cg * weight;
      b += cb * weight;
    }

    if (totalWeight <= 0) return null;
    return formatRgbString(r / totalWeight, g / totalWeight, b / totalWeight);
  }

  private pickTarget() {
    this.refreshCardWeights();

    const entries = [...this.cards.values()];
    if (!entries.length) return;

    const inBand = entries.filter((card) => card.bandWeight > 0);
    const blended =
      this.blendCardColors(inBand.length ? inBand : entries, inBand.length ? "band" : "near");

    if (!blended) return;

    const next = softenRgb(blended);
    if (rgbDistance(next, this.targetRgb) < MIN_COLOR_DELTA) return;

    this.animateTo(next, FEED_ANIMATION_MS);
  }

  private animateTo(nextRgb: string, duration = FEED_ANIMATION_MS) {
    if (
      rgbDistance(nextRgb, this.targetRgb) < MIN_COLOR_DELTA &&
      rgbDistance(nextRgb, this.displayRgb) < MIN_COLOR_DELTA &&
      !this.rafId
    ) {
      return;
    }

    this.targetRgb = nextRgb;
    this.animDuration = duration;
    this.animFrom = this.displayRgb;
    this.animTo = nextRgb;
    this.animStart = performance.now();

    if (!this.rafId) {
      this.rafId = window.requestAnimationFrame(this.tick);
    }
  }

  private tick = (now: number) => {
    const progress = Math.min(1, (now - this.animStart) / this.animDuration);
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - (-2 * progress + 2) ** 3 / 2;
    this.displayRgb = lerpRgbString(this.animFrom, this.animTo, eased);
    this.notify();

    if (progress < 1) {
      this.rafId = window.requestAnimationFrame(this.tick);
      return;
    }

    this.displayRgb = this.animTo;
    this.notify();
    this.rafId = null;
  };

  reportCard(
    id: string,
    rgb: string,
    element: Element,
    entry: IntersectionObserverEntry
  ) {
    this.ensureScrollListener();

    if (!entry.isIntersecting || entry.intersectionRatio < 0.08) {
      this.cards.delete(id);
      return;
    }

    this.storeCard(id, rgb, element, entry.boundingClientRect, entry.intersectionRatio);
  }

  reportCardRect(id: string, rgb: string, element: Element, rect: DOMRectReadOnly) {
    this.ensureScrollListener();

    const viewportHeight = window.innerHeight || 1;
    const visibility = this.getVisibility(rect, viewportHeight);
    if (visibility < 0.08) {
      this.cards.delete(id);
      return;
    }

    this.storeCard(id, rgb, element, rect, visibility);
  }

  private storeCard(
    id: string,
    rgb: string,
    element: Element,
    rect: DOMRectReadOnly,
    intersectionRatio: number
  ) {
    const viewportHeight = window.innerHeight || 1;
    const visibility = Math.min(1, intersectionRatio);
    const bandWeight = this.computeBandWeight(rect, viewportHeight) * visibility;
    const nearWeight = this.computeNearWeight(rect, viewportHeight) * visibility;

    const isFirstCard = this.cards.size === 0;
    this.cards.set(id, { rgb, element, bandWeight, nearWeight });

    this.schedulePick(isFirstCard ? 0 : undefined);
  }

  unregisterCard(id: string) {
    this.cards.delete(id);
  }

  setPoseColor(rgb: string) {
    this.cards.clear();
    this.animateTo(softenRgb(rgb), POSE_ANIMATION_MS);
  }

  subscribe(listener: (rgb: string) => void) {
    this.subscribers.add(listener);
    listener(this.displayRgb);
    return () => {
      this.subscribers.delete(listener);
    };
  }
}

export const dynamicBgEngine = new DynamicBgEngine();
