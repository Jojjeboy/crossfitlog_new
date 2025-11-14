import { Exercise } from "./exercise.interface";
import { CompletedSet } from "./completedSets.interface"

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
   * Datum för övning 
   */
  date: Date

  /**
   * En lista med set som genomfördes för denna övning
   */
  sets: CompletedSet[]

    /**
   * Eventuell notering.
   */
  note?: string
}

