/**
 * A "what-if" possible future projection of account behaviour.
 *
 * Used to model changes to current and past trends to plan potential real-world interventions.
 * @category Types
 * @subcategory Scenario
 */
export interface IScenario {
    /** The Card / Account which is associated. Future work will allow multi-card Scenarios. */
    cardId: string;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** Longer user-defined description of what this Scenario represents. */
    description: string;
    /** Optional end date to finish the scenario. */
    endDate: string | null;
    /** Unique identifier. */
    id: string;
    /** Optional start-date to begin the scenario from. */
    startDate: string | null;
    /** Account ballance to begin the scenario with. */
    startBallance: number;
    /** User-defined Scenario title. */
    title: string;
    /** List of Transactors which provide the Scenario with its expected future changes. */
    transactors?: ITransactor[];
    /** Unique identifier of the user who owns the Scenario. */
    userId: string;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
}

/**
 * Within the Scenario system, defines a specific expected one-off or repeatable action.
 *
 * A Transactor represents a single account action (income, outgoings, interest gained, etc.).
 *
 * Transactors use one or more Schedulers to define when their action should occur and on what pattern it should repeat.
 * @category Types
 * @subcategory Scenario
 */
export interface ITransactor {
    /** The ID of the Category this action represents. */
    categoryId: string | null;
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /** The user-defined description of this action. */
    description: string | null;
    /** Unique identifier. */
    id: string;
    /** If true, the value of `value` will be added to the ballance on trigger, otherwise treated as a subtraction. */
    isAddition: boolean;
    /** The Scenario this row belongs to. */
    scenarioId: string;
    /** Joined list of Schedulers. Is not returned for some actions such as update. */
    schedulers?: IScheduler[];
    /** ISO timestamp of most recent save. */
    updatedOn: string;
    /** The value to add or subtract from the balance. */
    value: number;
}

/**
 * Constructor used to create time based events within a given time band.
 *
 * Used by the Scenario system, Schedulers can be invoked to define clusters of calendar events tied to an expected action.
 *
 * Scheduler behaviour differs depending on its type (`schedulerCode`), at any given time only some fields are used.
 * @category Types
 * @subcategory Scenario
 */
export interface IScheduler {
    /** ISO timestamp of the date/time the record was first created. */
    createdOn: string;
    /**
     * Day of the week number from 0 - 6, representing Sunday - Saturday.
     *
     * Only applicable to some Schedulers.
     */
    day: number | null;
    /** Unique identifier. */
    id: string;
    /**
     * The day step representing what the repeat frequency of a schedule.
     *
     * Only applicable to some Schedulers.
     */
    nthDay: number | null;
    /** The type of scheduler logic to use. */
    schedulerCode: string;
    /**
     * Time in milliseconds which represents an interval for a repeat frequency.
     *
     * Only applicable to some Schedulers.
     */
    step: number | null;
    /**
     * The first date to trigger a schedule. Any frequency-based scheduler will anchor to this date.
     *
     * Only applicable to some Schedulers.
     */
    startDate: string | null;
    /** ID of the Transactor this Scheduler is attached to. */
    transactorId: string;
    /** ISO timestamp of most recent save. */
    updatedOn: string;
}

export type TSchedulerCode = 'DAY' | 'SCALAR' | 'DAY_OF_WEEK' | 'EVENT';
