import { Exercise } from "./excercise.interface"
import { CompletedSet } from "./completedSets.interface"

export interface CompletedExercise {
  
  /**
   * Id på aktiviteten
   */
  uuid: string

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

