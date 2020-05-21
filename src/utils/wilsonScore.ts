/**
 * Wilson score interval sort
 * (popularized by reddit's best comment system)
 * http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
 */

export function wilsonScore(z) {
    if (z == null) {
      // z represents the statistical confidence
      // z = 1.0 => ~69%, 1.96 => ~95% (default)
      z = 1.96;
    }

    return function(ups, downs) {
      const n = ups + downs;
      if (n === 0) {
        return 0;
      }

      const p = ups / n,
        sqrtexpr = (p * (1 - p) + (z * z) / (4 * n)) / n;
      return (
        (p + (z * z) / (2 * n) - z * Math.sqrt(sqrtexpr)) / (1 + (z * z) / n)
      );
    };
}