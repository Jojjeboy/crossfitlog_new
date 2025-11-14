import { CompletedSet } from "./completedSets.interface"

export interface CompletedOccasion {
  /**
   * Datum för omgång 
   */
  date: Date

  /**
   * Eventuell notering om känsla, tempo, form, etc.
   */
  note?: string


  /**
   * En lista med set som genomfördes för denna övning
   */
  sets: CompletedSet[]
}