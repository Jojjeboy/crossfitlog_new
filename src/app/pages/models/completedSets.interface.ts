export interface CompletedSet {
  /**
   * Antal repetitioner i detta set
   */
  reps: number

  /**
   * Vikt (om tillämpligt)
   */
  weight?: number

  /**
   * Eventuell notering om känsla, tempo, form, etc.
   */
  note?: string
}