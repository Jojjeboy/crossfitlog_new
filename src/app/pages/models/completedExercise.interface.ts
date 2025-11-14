import { Exercise } from "./exercise.interface";
import { CompletedSet } from "./completedSets.interface"
import { CompletedOccasion } from "./completedOccasion.interface";

export interface CompletedExercise {
  
  /**
   * Id på aktiviteten
   */
  uuid: string
    
  /**
   * Id på aktiviteten
   */
  lookupId: string

    /**
   * Referens till övningen (kopplar till Exercise-interface)
   */
  exercise: Exercise

  /**
   * En lista med set som genomfördes för denna övning
   */
  occasion: CompletedOccasion[]
}

