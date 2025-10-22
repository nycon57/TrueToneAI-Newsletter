
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * User model represents application users and their profile information
 * Maps to "users" table in the database
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Post
 * Post model represents newsletter posts and articles
 * Contains rich JSON content and publication workflow
 * Maps to "newsletter_posts" table in the database
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model Like
 * Like model represents user engagement with content
 * Tracks likes on articles and specific content sections
 * Maps to "likes" table in the database
 */
export type Like = $Result.DefaultSelection<Prisma.$LikePayload>
/**
 * Model UserSession
 * User session tracking for analytics and user journey insights
 * Maps to "user_sessions" table in the database
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model AnalyticsEvent
 * Comprehensive event tracking for user interactions and system events
 * Maps to "analytics_events" table in the database
 */
export type AnalyticsEvent = $Result.DefaultSelection<Prisma.$AnalyticsEventPayload>
/**
 * Model PageView
 * Page view tracking with detailed engagement metrics
 * Maps to "page_views" table in the database
 */
export type PageView = $Result.DefaultSelection<Prisma.$PageViewPayload>
/**
 * Model ChatAnalytics
 * AI chat analytics for conversation tracking and usage insights
 * Maps to "chat_analytics" table in the database
 */
export type ChatAnalytics = $Result.DefaultSelection<Prisma.$ChatAnalyticsPayload>
/**
 * Model Article
 * Article model represents team-curated content with default outputs
 * Maps to "articles" table in the database
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model PersonalizedOutput
 * PersonalizedOutput model represents AI-generated personalized versions of article content for paid users
 * Maps to "personalized_outputs" table in the database
 */
export type PersonalizedOutput = $Result.DefaultSelection<Prisma.$PersonalizedOutputPayload>
/**
 * Model AnonymousAiUsage
 * AnonymousAiUsage model tracks AI generation usage for non-authenticated users
 * Used to enforce free tier limits for anonymous users via session/IP tracking
 * Maps to "anonymous_ai_usage" table in the database
 */
export type AnonymousAiUsage = $Result.DefaultSelection<Prisma.$AnonymousAiUsagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PublishedStatus: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export type PublishedStatus = (typeof PublishedStatus)[keyof typeof PublishedStatus]


export const ContentType: {
  ARTICLE: 'ARTICLE',
  KEY_INSIGHTS: 'KEY_INSIGHTS',
  VIDEO_SCRIPT: 'VIDEO_SCRIPT',
  EMAIL_TEMPLATE: 'EMAIL_TEMPLATE',
  SOCIAL_CONTENT: 'SOCIAL_CONTENT'
};

export type ContentType = (typeof ContentType)[keyof typeof ContentType]


export const Device: {
  MOBILE: 'MOBILE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
  UNKNOWN: 'UNKNOWN'
};

export type Device = (typeof Device)[keyof typeof Device]


export const SubscriptionTier: {
  FREE: 'FREE',
  PAID: 'PAID',
  PREMIUM: 'PREMIUM'
};

export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier]


export const ArticleStatus: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus]

}

export type PublishedStatus = $Enums.PublishedStatus

export const PublishedStatus: typeof $Enums.PublishedStatus

export type ContentType = $Enums.ContentType

export const ContentType: typeof $Enums.ContentType

export type Device = $Enums.Device

export const Device: typeof $Enums.Device

export type SubscriptionTier = $Enums.SubscriptionTier

export const SubscriptionTier: typeof $Enums.SubscriptionTier

export type ArticleStatus = $Enums.ArticleStatus

export const ArticleStatus: typeof $Enums.ArticleStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.like`: Exposes CRUD operations for the **Like** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Likes
    * const likes = await prisma.like.findMany()
    * ```
    */
  get like(): Prisma.LikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analyticsEvent`: Exposes CRUD operations for the **AnalyticsEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalyticsEvents
    * const analyticsEvents = await prisma.analyticsEvent.findMany()
    * ```
    */
  get analyticsEvent(): Prisma.AnalyticsEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pageView`: Exposes CRUD operations for the **PageView** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PageViews
    * const pageViews = await prisma.pageView.findMany()
    * ```
    */
  get pageView(): Prisma.PageViewDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatAnalytics`: Exposes CRUD operations for the **ChatAnalytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatAnalytics
    * const chatAnalytics = await prisma.chatAnalytics.findMany()
    * ```
    */
  get chatAnalytics(): Prisma.ChatAnalyticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.personalizedOutput`: Exposes CRUD operations for the **PersonalizedOutput** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PersonalizedOutputs
    * const personalizedOutputs = await prisma.personalizedOutput.findMany()
    * ```
    */
  get personalizedOutput(): Prisma.PersonalizedOutputDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.anonymousAiUsage`: Exposes CRUD operations for the **AnonymousAiUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnonymousAiUsages
    * const anonymousAiUsages = await prisma.anonymousAiUsage.findMany()
    * ```
    */
  get anonymousAiUsage(): Prisma.AnonymousAiUsageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Post: 'Post',
    Like: 'Like',
    UserSession: 'UserSession',
    AnalyticsEvent: 'AnalyticsEvent',
    PageView: 'PageView',
    ChatAnalytics: 'ChatAnalytics',
    Article: 'Article',
    PersonalizedOutput: 'PersonalizedOutput',
    AnonymousAiUsage: 'AnonymousAiUsage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "post" | "like" | "userSession" | "analyticsEvent" | "pageView" | "chatAnalytics" | "article" | "personalizedOutput" | "anonymousAiUsage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      Like: {
        payload: Prisma.$LikePayload<ExtArgs>
        fields: Prisma.LikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          findFirst: {
            args: Prisma.LikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          findMany: {
            args: Prisma.LikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          create: {
            args: Prisma.LikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          createMany: {
            args: Prisma.LikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          delete: {
            args: Prisma.LikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          update: {
            args: Prisma.LikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          deleteMany: {
            args: Prisma.LikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LikeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[]
          }
          upsert: {
            args: Prisma.LikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LikePayload>
          }
          aggregate: {
            args: Prisma.LikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLike>
          }
          groupBy: {
            args: Prisma.LikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<LikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.LikeCountArgs<ExtArgs>
            result: $Utils.Optional<LikeCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      AnalyticsEvent: {
        payload: Prisma.$AnalyticsEventPayload<ExtArgs>
        fields: Prisma.AnalyticsEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalyticsEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalyticsEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          findFirst: {
            args: Prisma.AnalyticsEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalyticsEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          findMany: {
            args: Prisma.AnalyticsEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>[]
          }
          create: {
            args: Prisma.AnalyticsEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          createMany: {
            args: Prisma.AnalyticsEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalyticsEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>[]
          }
          delete: {
            args: Prisma.AnalyticsEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          update: {
            args: Prisma.AnalyticsEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          deleteMany: {
            args: Prisma.AnalyticsEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalyticsEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalyticsEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>[]
          }
          upsert: {
            args: Prisma.AnalyticsEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalyticsEventPayload>
          }
          aggregate: {
            args: Prisma.AnalyticsEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalyticsEvent>
          }
          groupBy: {
            args: Prisma.AnalyticsEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalyticsEventCountArgs<ExtArgs>
            result: $Utils.Optional<AnalyticsEventCountAggregateOutputType> | number
          }
        }
      }
      PageView: {
        payload: Prisma.$PageViewPayload<ExtArgs>
        fields: Prisma.PageViewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PageViewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PageViewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          findFirst: {
            args: Prisma.PageViewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PageViewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          findMany: {
            args: Prisma.PageViewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          create: {
            args: Prisma.PageViewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          createMany: {
            args: Prisma.PageViewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PageViewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          delete: {
            args: Prisma.PageViewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          update: {
            args: Prisma.PageViewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          deleteMany: {
            args: Prisma.PageViewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PageViewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PageViewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>[]
          }
          upsert: {
            args: Prisma.PageViewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageViewPayload>
          }
          aggregate: {
            args: Prisma.PageViewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePageView>
          }
          groupBy: {
            args: Prisma.PageViewGroupByArgs<ExtArgs>
            result: $Utils.Optional<PageViewGroupByOutputType>[]
          }
          count: {
            args: Prisma.PageViewCountArgs<ExtArgs>
            result: $Utils.Optional<PageViewCountAggregateOutputType> | number
          }
        }
      }
      ChatAnalytics: {
        payload: Prisma.$ChatAnalyticsPayload<ExtArgs>
        fields: Prisma.ChatAnalyticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatAnalyticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatAnalyticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          findFirst: {
            args: Prisma.ChatAnalyticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatAnalyticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          findMany: {
            args: Prisma.ChatAnalyticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>[]
          }
          create: {
            args: Prisma.ChatAnalyticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          createMany: {
            args: Prisma.ChatAnalyticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatAnalyticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>[]
          }
          delete: {
            args: Prisma.ChatAnalyticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          update: {
            args: Prisma.ChatAnalyticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          deleteMany: {
            args: Prisma.ChatAnalyticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatAnalyticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatAnalyticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>[]
          }
          upsert: {
            args: Prisma.ChatAnalyticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatAnalyticsPayload>
          }
          aggregate: {
            args: Prisma.ChatAnalyticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatAnalytics>
          }
          groupBy: {
            args: Prisma.ChatAnalyticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatAnalyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatAnalyticsCountArgs<ExtArgs>
            result: $Utils.Optional<ChatAnalyticsCountAggregateOutputType> | number
          }
        }
      }
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      PersonalizedOutput: {
        payload: Prisma.$PersonalizedOutputPayload<ExtArgs>
        fields: Prisma.PersonalizedOutputFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonalizedOutputFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonalizedOutputFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          findFirst: {
            args: Prisma.PersonalizedOutputFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonalizedOutputFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          findMany: {
            args: Prisma.PersonalizedOutputFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>[]
          }
          create: {
            args: Prisma.PersonalizedOutputCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          createMany: {
            args: Prisma.PersonalizedOutputCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonalizedOutputCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>[]
          }
          delete: {
            args: Prisma.PersonalizedOutputDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          update: {
            args: Prisma.PersonalizedOutputUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          deleteMany: {
            args: Prisma.PersonalizedOutputDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonalizedOutputUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PersonalizedOutputUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>[]
          }
          upsert: {
            args: Prisma.PersonalizedOutputUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalizedOutputPayload>
          }
          aggregate: {
            args: Prisma.PersonalizedOutputAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersonalizedOutput>
          }
          groupBy: {
            args: Prisma.PersonalizedOutputGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonalizedOutputGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonalizedOutputCountArgs<ExtArgs>
            result: $Utils.Optional<PersonalizedOutputCountAggregateOutputType> | number
          }
        }
      }
      AnonymousAiUsage: {
        payload: Prisma.$AnonymousAiUsagePayload<ExtArgs>
        fields: Prisma.AnonymousAiUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnonymousAiUsageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnonymousAiUsageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          findFirst: {
            args: Prisma.AnonymousAiUsageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnonymousAiUsageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          findMany: {
            args: Prisma.AnonymousAiUsageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>[]
          }
          create: {
            args: Prisma.AnonymousAiUsageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          createMany: {
            args: Prisma.AnonymousAiUsageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnonymousAiUsageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>[]
          }
          delete: {
            args: Prisma.AnonymousAiUsageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          update: {
            args: Prisma.AnonymousAiUsageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          deleteMany: {
            args: Prisma.AnonymousAiUsageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnonymousAiUsageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnonymousAiUsageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>[]
          }
          upsert: {
            args: Prisma.AnonymousAiUsageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnonymousAiUsagePayload>
          }
          aggregate: {
            args: Prisma.AnonymousAiUsageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnonymousAiUsage>
          }
          groupBy: {
            args: Prisma.AnonymousAiUsageGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnonymousAiUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnonymousAiUsageCountArgs<ExtArgs>
            result: $Utils.Optional<AnonymousAiUsageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    post?: PostOmit
    like?: LikeOmit
    userSession?: UserSessionOmit
    analyticsEvent?: AnalyticsEventOmit
    pageView?: PageViewOmit
    chatAnalytics?: ChatAnalyticsOmit
    article?: ArticleOmit
    personalizedOutput?: PersonalizedOutputOmit
    anonymousAiUsage?: AnonymousAiUsageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    likes: number
    sessions: number
    events: number
    pageViews: number
    chatAnalytics: number
    createdArticles: number
    editedArticles: number
    personalizations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | UserCountOutputTypeCountLikesArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    events?: boolean | UserCountOutputTypeCountEventsArgs
    pageViews?: boolean | UserCountOutputTypeCountPageViewsArgs
    chatAnalytics?: boolean | UserCountOutputTypeCountChatAnalyticsArgs
    createdArticles?: boolean | UserCountOutputTypeCountCreatedArticlesArgs
    editedArticles?: boolean | UserCountOutputTypeCountEditedArticlesArgs
    personalizations?: boolean | UserCountOutputTypeCountPersonalizationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsEventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPageViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageViewWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatAnalyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatAnalyticsWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEditedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPersonalizationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalizedOutputWhereInput
  }


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    likes: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | PostCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
  }


  /**
   * Count Type UserSessionCountOutputType
   */

  export type UserSessionCountOutputType = {
    events: number
    pageViewsRel: number
    chatSessions: number
  }

  export type UserSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | UserSessionCountOutputTypeCountEventsArgs
    pageViewsRel?: boolean | UserSessionCountOutputTypeCountPageViewsRelArgs
    chatSessions?: boolean | UserSessionCountOutputTypeCountChatSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserSessionCountOutputType without action
   */
  export type UserSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSessionCountOutputType
     */
    select?: UserSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserSessionCountOutputType without action
   */
  export type UserSessionCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsEventWhereInput
  }

  /**
   * UserSessionCountOutputType without action
   */
  export type UserSessionCountOutputTypeCountPageViewsRelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageViewWhereInput
  }

  /**
   * UserSessionCountOutputType without action
   */
  export type UserSessionCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatAnalyticsWhereInput
  }


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    personalizations: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personalizations?: boolean | ArticleCountOutputTypeCountPersonalizationsArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountPersonalizationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalizedOutputWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    monthlyGenerationLimit: number | null
    monthlyGenerationsUsed: number | null
    onboardingStep: number | null
  }

  export type UserSumAggregateOutputType = {
    monthlyGenerationLimit: number | null
    monthlyGenerationsUsed: number | null
    onboardingStep: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    company: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kindeId: string | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionStatus: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCreatedAt: Date | null
    monthlyGenerationLimit: number | null
    monthlyGenerationsUsed: number | null
    generationResetDate: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    hasCompletedOnboarding: boolean | null
    onboardingStep: number | null
    onboardingCompletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    company: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kindeId: string | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionStatus: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCreatedAt: Date | null
    monthlyGenerationLimit: number | null
    monthlyGenerationsUsed: number | null
    generationResetDate: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    hasCompletedOnboarding: boolean | null
    onboardingStep: number | null
    onboardingCompletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    firstName: number
    lastName: number
    email: number
    company: number
    avatar: number
    createdAt: number
    updatedAt: number
    kindeId: number
    categoryPreferences: number
    savedArticleIds: number
    subscriptionTier: number
    subscriptionStatus: number
    subscriptionExpiresAt: number
    subscriptionCreatedAt: number
    monthlyGenerationLimit: number
    monthlyGenerationsUsed: number
    generationResetDate: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    stripePriceId: number
    hasCompletedOnboarding: number
    onboardingStep: number
    onboardingCompletedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    monthlyGenerationLimit?: true
    monthlyGenerationsUsed?: true
    onboardingStep?: true
  }

  export type UserSumAggregateInputType = {
    monthlyGenerationLimit?: true
    monthlyGenerationsUsed?: true
    onboardingStep?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    firstName?: true
    lastName?: true
    email?: true
    company?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    kindeId?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    subscriptionExpiresAt?: true
    subscriptionCreatedAt?: true
    monthlyGenerationLimit?: true
    monthlyGenerationsUsed?: true
    generationResetDate?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    hasCompletedOnboarding?: true
    onboardingStep?: true
    onboardingCompletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    firstName?: true
    lastName?: true
    email?: true
    company?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    kindeId?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    subscriptionExpiresAt?: true
    subscriptionCreatedAt?: true
    monthlyGenerationLimit?: true
    monthlyGenerationsUsed?: true
    generationResetDate?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    hasCompletedOnboarding?: true
    onboardingStep?: true
    onboardingCompletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    firstName?: true
    lastName?: true
    email?: true
    company?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    kindeId?: true
    categoryPreferences?: true
    savedArticleIds?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    subscriptionExpiresAt?: true
    subscriptionCreatedAt?: true
    monthlyGenerationLimit?: true
    monthlyGenerationsUsed?: true
    generationResetDate?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    stripePriceId?: true
    hasCompletedOnboarding?: true
    onboardingStep?: true
    onboardingCompletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    company: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    kindeId: string | null
    categoryPreferences: string[]
    savedArticleIds: string[]
    subscriptionTier: $Enums.SubscriptionTier
    subscriptionStatus: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCreatedAt: Date | null
    monthlyGenerationLimit: number
    monthlyGenerationsUsed: number
    generationResetDate: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripePriceId: string | null
    hasCompletedOnboarding: boolean
    onboardingStep: number | null
    onboardingCompletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    company?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kindeId?: boolean
    categoryPreferences?: boolean
    savedArticleIds?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    subscriptionExpiresAt?: boolean
    subscriptionCreatedAt?: boolean
    monthlyGenerationLimit?: boolean
    monthlyGenerationsUsed?: boolean
    generationResetDate?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    hasCompletedOnboarding?: boolean
    onboardingStep?: boolean
    onboardingCompletedAt?: boolean
    likes?: boolean | User$likesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    events?: boolean | User$eventsArgs<ExtArgs>
    pageViews?: boolean | User$pageViewsArgs<ExtArgs>
    chatAnalytics?: boolean | User$chatAnalyticsArgs<ExtArgs>
    createdArticles?: boolean | User$createdArticlesArgs<ExtArgs>
    editedArticles?: boolean | User$editedArticlesArgs<ExtArgs>
    personalizations?: boolean | User$personalizationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    company?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kindeId?: boolean
    categoryPreferences?: boolean
    savedArticleIds?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    subscriptionExpiresAt?: boolean
    subscriptionCreatedAt?: boolean
    monthlyGenerationLimit?: boolean
    monthlyGenerationsUsed?: boolean
    generationResetDate?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    hasCompletedOnboarding?: boolean
    onboardingStep?: boolean
    onboardingCompletedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    company?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kindeId?: boolean
    categoryPreferences?: boolean
    savedArticleIds?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    subscriptionExpiresAt?: boolean
    subscriptionCreatedAt?: boolean
    monthlyGenerationLimit?: boolean
    monthlyGenerationsUsed?: boolean
    generationResetDate?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    hasCompletedOnboarding?: boolean
    onboardingStep?: boolean
    onboardingCompletedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    company?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kindeId?: boolean
    categoryPreferences?: boolean
    savedArticleIds?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    subscriptionExpiresAt?: boolean
    subscriptionCreatedAt?: boolean
    monthlyGenerationLimit?: boolean
    monthlyGenerationsUsed?: boolean
    generationResetDate?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    stripePriceId?: boolean
    hasCompletedOnboarding?: boolean
    onboardingStep?: boolean
    onboardingCompletedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "firstName" | "lastName" | "email" | "company" | "avatar" | "createdAt" | "updatedAt" | "kindeId" | "categoryPreferences" | "savedArticleIds" | "subscriptionTier" | "subscriptionStatus" | "subscriptionExpiresAt" | "subscriptionCreatedAt" | "monthlyGenerationLimit" | "monthlyGenerationsUsed" | "generationResetDate" | "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId" | "hasCompletedOnboarding" | "onboardingStep" | "onboardingCompletedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | User$likesArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    events?: boolean | User$eventsArgs<ExtArgs>
    pageViews?: boolean | User$pageViewsArgs<ExtArgs>
    chatAnalytics?: boolean | User$chatAnalyticsArgs<ExtArgs>
    createdArticles?: boolean | User$createdArticlesArgs<ExtArgs>
    editedArticles?: boolean | User$editedArticlesArgs<ExtArgs>
    personalizations?: boolean | User$personalizationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      /**
       * User's likes on various content
       */
      likes: Prisma.$LikePayload<ExtArgs>[]
      /**
       * User's analytics sessions
       */
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
      /**
       * User's tracked events
       */
      events: Prisma.$AnalyticsEventPayload<ExtArgs>[]
      /**
       * User's page view history
       */
      pageViews: Prisma.$PageViewPayload<ExtArgs>[]
      /**
       * User's AI chat usage analytics
       */
      chatAnalytics: Prisma.$ChatAnalyticsPayload<ExtArgs>[]
      /**
       * Articles created by this admin user
       */
      createdArticles: Prisma.$ArticlePayload<ExtArgs>[]
      /**
       * Articles last edited by this admin user
       */
      editedArticles: Prisma.$ArticlePayload<ExtArgs>[]
      /**
       * User's personalized content outputs
       */
      personalizations: Prisma.$PersonalizedOutputPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the user - auto-generated UUID
       */
      id: string
      /**
       * Full display name of the user - defaults to "Not Set" for existing records
       */
      name: string
      /**
       * User's first name - defaults to "Not Set" for existing records
       */
      firstName: string
      /**
       * User's last name - defaults to "Not Set" for existing records
       */
      lastName: string
      /**
       * User's email address - must be unique across all users
       */
      email: string
      /**
       * Optional company name where the user works
       */
      company: string | null
      /**
       * URL to user profile avatar image stored in Supabase Storage
       */
      avatar: string | null
      /**
       * Timestamp when the user account was created
       */
      createdAt: Date
      /**
       * Timestamp when the user record was last updated
       */
      updatedAt: Date
      /**
       * Kinde authentication provider ID - unique identifier from Kinde
       */
      kindeId: string | null
      /**
       * User's preferred content categories
       */
      categoryPreferences: string[]
      /**
       * IDs of articles saved by the user
       */
      savedArticleIds: string[]
      /**
       * User's subscription level
       */
      subscriptionTier: $Enums.SubscriptionTier
      /**
       * Current subscription status (active, trialing, canceled, etc.)
       */
      subscriptionStatus: string | null
      /**
       * When subscription expires
       */
      subscriptionExpiresAt: Date | null
      /**
       * When subscription was created
       */
      subscriptionCreatedAt: Date | null
      /**
       * Max AI generations per month
       */
      monthlyGenerationLimit: number
      /**
       * AI generations used this month
       */
      monthlyGenerationsUsed: number
      /**
       * Date when monthly count resets
       */
      generationResetDate: Date | null
      /**
       * Stripe customer ID for billing
       */
      stripeCustomerId: string | null
      /**
       * Stripe subscription ID
       */
      stripeSubscriptionId: string | null
      /**
       * Stripe price ID for the subscription
       */
      stripePriceId: string | null
      /**
       * Whether user has completed onboarding flow
       */
      hasCompletedOnboarding: boolean
      /**
       * Current onboarding step (1-6)
       */
      onboardingStep: number | null
      /**
       * When onboarding was completed
       */
      onboardingCompletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    likes<T extends User$likesArgs<ExtArgs> = {}>(args?: Subset<T, User$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends User$eventsArgs<ExtArgs> = {}>(args?: Subset<T, User$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pageViews<T extends User$pageViewsArgs<ExtArgs> = {}>(args?: Subset<T, User$pageViewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatAnalytics<T extends User$chatAnalyticsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatAnalyticsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    createdArticles<T extends User$createdArticlesArgs<ExtArgs> = {}>(args?: Subset<T, User$createdArticlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    editedArticles<T extends User$editedArticlesArgs<ExtArgs> = {}>(args?: Subset<T, User$editedArticlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    personalizations<T extends User$personalizationsArgs<ExtArgs> = {}>(args?: Subset<T, User$personalizationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly company: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly kindeId: FieldRef<"User", 'String'>
    readonly categoryPreferences: FieldRef<"User", 'String[]'>
    readonly savedArticleIds: FieldRef<"User", 'String[]'>
    readonly subscriptionTier: FieldRef<"User", 'SubscriptionTier'>
    readonly subscriptionStatus: FieldRef<"User", 'String'>
    readonly subscriptionExpiresAt: FieldRef<"User", 'DateTime'>
    readonly subscriptionCreatedAt: FieldRef<"User", 'DateTime'>
    readonly monthlyGenerationLimit: FieldRef<"User", 'Int'>
    readonly monthlyGenerationsUsed: FieldRef<"User", 'Int'>
    readonly generationResetDate: FieldRef<"User", 'DateTime'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
    readonly stripeSubscriptionId: FieldRef<"User", 'String'>
    readonly stripePriceId: FieldRef<"User", 'String'>
    readonly hasCompletedOnboarding: FieldRef<"User", 'Boolean'>
    readonly onboardingStep: FieldRef<"User", 'Int'>
    readonly onboardingCompletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.likes
   */
  export type User$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    cursor?: LikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User.events
   */
  export type User$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    where?: AnalyticsEventWhereInput
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    cursor?: AnalyticsEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * User.pageViews
   */
  export type User$pageViewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    where?: PageViewWhereInput
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    cursor?: PageViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * User.chatAnalytics
   */
  export type User$chatAnalyticsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    where?: ChatAnalyticsWhereInput
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    cursor?: ChatAnalyticsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatAnalyticsScalarFieldEnum | ChatAnalyticsScalarFieldEnum[]
  }

  /**
   * User.createdArticles
   */
  export type User$createdArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * User.editedArticles
   */
  export type User$editedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * User.personalizations
   */
  export type User$personalizationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    where?: PersonalizedOutputWhereInput
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    cursor?: PersonalizedOutputWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersonalizedOutputScalarFieldEnum | PersonalizedOutputScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    title: string | null
    publishedStatus: $Enums.PublishedStatus | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    title: string | null
    publishedStatus: $Enums.PublishedStatus | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    title: number
    content: number
    publishedStatus: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PostMinAggregateInputType = {
    id?: true
    title?: true
    publishedStatus?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    title?: true
    publishedStatus?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    publishedStatus?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    title: string
    content: JsonValue
    publishedStatus: $Enums.PublishedStatus
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    publishedStatus?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    likes?: boolean | Post$likesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    publishedStatus?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    publishedStatus?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    publishedStatus?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "publishedStatus" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    likes?: boolean | Post$likesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      /**
       * Likes on this post and its content
       */
      likes: Prisma.$LikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the post - auto-generated UUID
       */
      id: string
      /**
       * Title of the post - displayed as headline
       */
      title: string
      /**
       * Rich content stored as JSON
       */
      content: Prisma.JsonValue
      /**
       * Current publication status of the post - defaults to DRAFT
       */
      publishedStatus: $Enums.PublishedStatus
      /**
       * Timestamp when the post was published (null if never published)
       */
      publishedAt: Date | null
      /**
       * Timestamp when the post was created
       */
      createdAt: Date
      /**
       * Timestamp when the post was last updated
       */
      updatedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    likes<T extends Post$likesArgs<ExtArgs> = {}>(args?: Subset<T, Post$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly title: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'Json'>
    readonly publishedStatus: FieldRef<"Post", 'PublishedStatus'>
    readonly publishedAt: FieldRef<"Post", 'DateTime'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post.likes
   */
  export type Post$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    cursor?: LikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model Like
   */

  export type AggregateLike = {
    _count: LikeCountAggregateOutputType | null
    _min: LikeMinAggregateOutputType | null
    _max: LikeMaxAggregateOutputType | null
  }

  export type LikeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    contentId: string | null
    contentType: $Enums.ContentType | null
    contentTitle: string | null
    deviceType: $Enums.Device | null
    timestamp: Date | null
  }

  export type LikeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    postId: string | null
    contentId: string | null
    contentType: $Enums.ContentType | null
    contentTitle: string | null
    deviceType: $Enums.Device | null
    timestamp: Date | null
  }

  export type LikeCountAggregateOutputType = {
    id: number
    userId: number
    postId: number
    contentId: number
    contentType: number
    contentTitle: number
    deviceType: number
    timestamp: number
    _all: number
  }


  export type LikeMinAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    contentId?: true
    contentType?: true
    contentTitle?: true
    deviceType?: true
    timestamp?: true
  }

  export type LikeMaxAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    contentId?: true
    contentType?: true
    contentTitle?: true
    deviceType?: true
    timestamp?: true
  }

  export type LikeCountAggregateInputType = {
    id?: true
    userId?: true
    postId?: true
    contentId?: true
    contentType?: true
    contentTitle?: true
    deviceType?: true
    timestamp?: true
    _all?: true
  }

  export type LikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Like to aggregate.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Likes
    **/
    _count?: true | LikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LikeMaxAggregateInputType
  }

  export type GetLikeAggregateType<T extends LikeAggregateArgs> = {
        [P in keyof T & keyof AggregateLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLike[P]>
      : GetScalarType<T[P], AggregateLike[P]>
  }




  export type LikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LikeWhereInput
    orderBy?: LikeOrderByWithAggregationInput | LikeOrderByWithAggregationInput[]
    by: LikeScalarFieldEnum[] | LikeScalarFieldEnum
    having?: LikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LikeCountAggregateInputType | true
    _min?: LikeMinAggregateInputType
    _max?: LikeMaxAggregateInputType
  }

  export type LikeGroupByOutputType = {
    id: string
    userId: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType: $Enums.Device
    timestamp: Date
    _count: LikeCountAggregateOutputType | null
    _min: LikeMinAggregateOutputType | null
    _max: LikeMaxAggregateOutputType | null
  }

  type GetLikeGroupByPayload<T extends LikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LikeGroupByOutputType[P]>
            : GetScalarType<T[P], LikeGroupByOutputType[P]>
        }
      >
    >


  export type LikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    contentId?: boolean
    contentType?: boolean
    contentTitle?: boolean
    deviceType?: boolean
    timestamp?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    contentId?: boolean
    contentType?: boolean
    contentTitle?: boolean
    deviceType?: boolean
    timestamp?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    postId?: boolean
    contentId?: boolean
    contentType?: boolean
    contentTitle?: boolean
    deviceType?: boolean
    timestamp?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["like"]>

  export type LikeSelectScalar = {
    id?: boolean
    userId?: boolean
    postId?: boolean
    contentId?: boolean
    contentType?: boolean
    contentTitle?: boolean
    deviceType?: boolean
    timestamp?: boolean
  }

  export type LikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "postId" | "contentId" | "contentType" | "contentTitle" | "deviceType" | "timestamp", ExtArgs["result"]["like"]>
  export type LikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type LikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type LikeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    post?: boolean | PostDefaultArgs<ExtArgs>
  }

  export type $LikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Like"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      post: Prisma.$PostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the like
       */
      id: string
      /**
       * ID of the user who liked
       */
      userId: string
      /**
       * ID of the post containing the content
       */
      postId: string
      /**
       * Stable contentID from the JSONB content
       */
      contentId: string
      /**
       * Type of content being liked
       */
      contentType: $Enums.ContentType
      /**
       * Human-readable title of the liked content
       */
      contentTitle: string
      /**
       * Device type used when liking
       */
      deviceType: $Enums.Device
      /**
       * When the like was created
       */
      timestamp: Date
    }, ExtArgs["result"]["like"]>
    composites: {}
  }

  type LikeGetPayload<S extends boolean | null | undefined | LikeDefaultArgs> = $Result.GetResult<Prisma.$LikePayload, S>

  type LikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LikeCountAggregateInputType | true
    }

  export interface LikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Like'], meta: { name: 'Like' } }
    /**
     * Find zero or one Like that matches the filter.
     * @param {LikeFindUniqueArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LikeFindUniqueArgs>(args: SelectSubset<T, LikeFindUniqueArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Like that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LikeFindUniqueOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LikeFindUniqueOrThrowArgs>(args: SelectSubset<T, LikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Like that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LikeFindFirstArgs>(args?: SelectSubset<T, LikeFindFirstArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Like that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LikeFindFirstOrThrowArgs>(args?: SelectSubset<T, LikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Likes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Likes
     * const likes = await prisma.like.findMany()
     * 
     * // Get first 10 Likes
     * const likes = await prisma.like.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const likeWithIdOnly = await prisma.like.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LikeFindManyArgs>(args?: SelectSubset<T, LikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Like.
     * @param {LikeCreateArgs} args - Arguments to create a Like.
     * @example
     * // Create one Like
     * const Like = await prisma.like.create({
     *   data: {
     *     // ... data to create a Like
     *   }
     * })
     * 
     */
    create<T extends LikeCreateArgs>(args: SelectSubset<T, LikeCreateArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Likes.
     * @param {LikeCreateManyArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LikeCreateManyArgs>(args?: SelectSubset<T, LikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Likes and returns the data saved in the database.
     * @param {LikeCreateManyAndReturnArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LikeCreateManyAndReturnArgs>(args?: SelectSubset<T, LikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Like.
     * @param {LikeDeleteArgs} args - Arguments to delete one Like.
     * @example
     * // Delete one Like
     * const Like = await prisma.like.delete({
     *   where: {
     *     // ... filter to delete one Like
     *   }
     * })
     * 
     */
    delete<T extends LikeDeleteArgs>(args: SelectSubset<T, LikeDeleteArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Like.
     * @param {LikeUpdateArgs} args - Arguments to update one Like.
     * @example
     * // Update one Like
     * const like = await prisma.like.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LikeUpdateArgs>(args: SelectSubset<T, LikeUpdateArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Likes.
     * @param {LikeDeleteManyArgs} args - Arguments to filter Likes to delete.
     * @example
     * // Delete a few Likes
     * const { count } = await prisma.like.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LikeDeleteManyArgs>(args?: SelectSubset<T, LikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LikeUpdateManyArgs>(args: SelectSubset<T, LikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Likes and returns the data updated in the database.
     * @param {LikeUpdateManyAndReturnArgs} args - Arguments to update many Likes.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LikeUpdateManyAndReturnArgs>(args: SelectSubset<T, LikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Like.
     * @param {LikeUpsertArgs} args - Arguments to update or create a Like.
     * @example
     * // Update or create a Like
     * const like = await prisma.like.upsert({
     *   create: {
     *     // ... data to create a Like
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Like we want to update
     *   }
     * })
     */
    upsert<T extends LikeUpsertArgs>(args: SelectSubset<T, LikeUpsertArgs<ExtArgs>>): Prisma__LikeClient<$Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeCountArgs} args - Arguments to filter Likes to count.
     * @example
     * // Count the number of Likes
     * const count = await prisma.like.count({
     *   where: {
     *     // ... the filter for the Likes we want to count
     *   }
     * })
    **/
    count<T extends LikeCountArgs>(
      args?: Subset<T, LikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LikeAggregateArgs>(args: Subset<T, LikeAggregateArgs>): Prisma.PrismaPromise<GetLikeAggregateType<T>>

    /**
     * Group by Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LikeGroupByArgs['orderBy'] }
        : { orderBy?: LikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Like model
   */
  readonly fields: LikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Like.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Like model
   */
  interface LikeFieldRefs {
    readonly id: FieldRef<"Like", 'String'>
    readonly userId: FieldRef<"Like", 'String'>
    readonly postId: FieldRef<"Like", 'String'>
    readonly contentId: FieldRef<"Like", 'String'>
    readonly contentType: FieldRef<"Like", 'ContentType'>
    readonly contentTitle: FieldRef<"Like", 'String'>
    readonly deviceType: FieldRef<"Like", 'Device'>
    readonly timestamp: FieldRef<"Like", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Like findUnique
   */
  export type LikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like findUniqueOrThrow
   */
  export type LikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like findFirst
   */
  export type LikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like findFirstOrThrow
   */
  export type LikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like findMany
   */
  export type LikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter, which Likes to fetch.
     */
    where?: LikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Likes.
     */
    cursor?: LikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Likes.
     */
    skip?: number
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[]
  }

  /**
   * Like create
   */
  export type LikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The data needed to create a Like.
     */
    data: XOR<LikeCreateInput, LikeUncheckedCreateInput>
  }

  /**
   * Like createMany
   */
  export type LikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Like createManyAndReturn
   */
  export type LikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Like update
   */
  export type LikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The data needed to update a Like.
     */
    data: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>
    /**
     * Choose, which Like to update.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like updateMany
   */
  export type LikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to update.
     */
    limit?: number
  }

  /**
   * Like updateManyAndReturn
   */
  export type LikeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Like upsert
   */
  export type LikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * The filter to search for the Like to update in case it exists.
     */
    where: LikeWhereUniqueInput
    /**
     * In case the Like found by the `where` argument doesn't exist, create a new Like with this data.
     */
    create: XOR<LikeCreateInput, LikeUncheckedCreateInput>
    /**
     * In case the Like was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>
  }

  /**
   * Like delete
   */
  export type LikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
    /**
     * Filter which Like to delete.
     */
    where: LikeWhereUniqueInput
  }

  /**
   * Like deleteMany
   */
  export type LikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Likes to delete
     */
    where?: LikeWhereInput
    /**
     * Limit how many Likes to delete.
     */
    limit?: number
  }

  /**
   * Like without action
   */
  export type LikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _avg: UserSessionAvgAggregateOutputType | null
    _sum: UserSessionSumAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionAvgAggregateOutputType = {
    pageViews: number | null
    eventsCount: number | null
  }

  export type UserSessionSumAggregateOutputType = {
    pageViews: number | null
    eventsCount: number | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    ipAddress: string | null
    userAgent: string | null
    deviceType: $Enums.Device | null
    countryCode: string | null
    region: string | null
    city: string | null
    startedAt: Date | null
    lastActiveAt: Date | null
    endedAt: Date | null
    pageViews: number | null
    eventsCount: number | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    ipAddress: string | null
    userAgent: string | null
    deviceType: $Enums.Device | null
    countryCode: string | null
    region: string | null
    city: string | null
    startedAt: Date | null
    lastActiveAt: Date | null
    endedAt: Date | null
    pageViews: number | null
    eventsCount: number | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    ipAddress: number
    userAgent: number
    deviceType: number
    countryCode: number
    region: number
    city: number
    startedAt: number
    lastActiveAt: number
    endedAt: number
    pageViews: number
    eventsCount: number
    _all: number
  }


  export type UserSessionAvgAggregateInputType = {
    pageViews?: true
    eventsCount?: true
  }

  export type UserSessionSumAggregateInputType = {
    pageViews?: true
    eventsCount?: true
  }

  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    ipAddress?: true
    userAgent?: true
    deviceType?: true
    countryCode?: true
    region?: true
    city?: true
    startedAt?: true
    lastActiveAt?: true
    endedAt?: true
    pageViews?: true
    eventsCount?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    ipAddress?: true
    userAgent?: true
    deviceType?: true
    countryCode?: true
    region?: true
    city?: true
    startedAt?: true
    lastActiveAt?: true
    endedAt?: true
    pageViews?: true
    eventsCount?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    ipAddress?: true
    userAgent?: true
    deviceType?: true
    countryCode?: true
    region?: true
    city?: true
    startedAt?: true
    lastActiveAt?: true
    endedAt?: true
    pageViews?: true
    eventsCount?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _avg?: UserSessionAvgAggregateInputType
    _sum?: UserSessionSumAggregateInputType
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string | null
    sessionId: string
    ipAddress: string | null
    userAgent: string | null
    deviceType: $Enums.Device
    countryCode: string | null
    region: string | null
    city: string | null
    startedAt: Date
    lastActiveAt: Date
    endedAt: Date | null
    pageViews: number
    eventsCount: number
    _count: UserSessionCountAggregateOutputType | null
    _avg: UserSessionAvgAggregateOutputType | null
    _sum: UserSessionSumAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    deviceType?: boolean
    countryCode?: boolean
    region?: boolean
    city?: boolean
    startedAt?: boolean
    lastActiveAt?: boolean
    endedAt?: boolean
    pageViews?: boolean
    eventsCount?: boolean
    user?: boolean | UserSession$userArgs<ExtArgs>
    events?: boolean | UserSession$eventsArgs<ExtArgs>
    pageViewsRel?: boolean | UserSession$pageViewsRelArgs<ExtArgs>
    chatSessions?: boolean | UserSession$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    deviceType?: boolean
    countryCode?: boolean
    region?: boolean
    city?: boolean
    startedAt?: boolean
    lastActiveAt?: boolean
    endedAt?: boolean
    pageViews?: boolean
    eventsCount?: boolean
    user?: boolean | UserSession$userArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    deviceType?: boolean
    countryCode?: boolean
    region?: boolean
    city?: boolean
    startedAt?: boolean
    lastActiveAt?: boolean
    endedAt?: boolean
    pageViews?: boolean
    eventsCount?: boolean
    user?: boolean | UserSession$userArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    deviceType?: boolean
    countryCode?: boolean
    region?: boolean
    city?: boolean
    startedAt?: boolean
    lastActiveAt?: boolean
    endedAt?: boolean
    pageViews?: boolean
    eventsCount?: boolean
  }

  export type UserSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "ipAddress" | "userAgent" | "deviceType" | "countryCode" | "region" | "city" | "startedAt" | "lastActiveAt" | "endedAt" | "pageViews" | "eventsCount", ExtArgs["result"]["userSession"]>
  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserSession$userArgs<ExtArgs>
    events?: boolean | UserSession$eventsArgs<ExtArgs>
    pageViewsRel?: boolean | UserSession$pageViewsRelArgs<ExtArgs>
    chatSessions?: boolean | UserSession$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserSession$userArgs<ExtArgs>
  }
  export type UserSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserSession$userArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      events: Prisma.$AnalyticsEventPayload<ExtArgs>[]
      pageViewsRel: Prisma.$PageViewPayload<ExtArgs>[]
      chatSessions: Prisma.$ChatAnalyticsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique session identifier
       */
      id: string
      /**
       * Associated user (null for anonymous sessions)
       */
      userId: string | null
      /**
       * Client-generated session ID
       */
      sessionId: string
      /**
       * User's IP address for geolocation
       */
      ipAddress: string | null
      /**
       * Browser/device user agent string
       */
      userAgent: string | null
      /**
       * Detected device type
       */
      deviceType: $Enums.Device
      /**
       * ISO country code from IP
       */
      countryCode: string | null
      /**
       * State/region from IP geolocation
       */
      region: string | null
      /**
       * City from IP geolocation
       */
      city: string | null
      /**
       * Session start timestamp
       */
      startedAt: Date
      /**
       * Last activity timestamp
       */
      lastActiveAt: Date
      /**
       * Session end timestamp (null if active)
       */
      endedAt: Date | null
      /**
       * Number of page views in session
       */
      pageViews: number
      /**
       * Total events tracked in session
       */
      eventsCount: number
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions and returns the data updated in the database.
     * @param {UserSessionUpdateManyAndReturnArgs} args - Arguments to update many UserSessions.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserSession$userArgs<ExtArgs> = {}>(args?: Subset<T, UserSession$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    events<T extends UserSession$eventsArgs<ExtArgs> = {}>(args?: Subset<T, UserSession$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pageViewsRel<T extends UserSession$pageViewsRelArgs<ExtArgs> = {}>(args?: Subset<T, UserSession$pageViewsRelArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatSessions<T extends UserSession$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, UserSession$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly sessionId: FieldRef<"UserSession", 'String'>
    readonly ipAddress: FieldRef<"UserSession", 'String'>
    readonly userAgent: FieldRef<"UserSession", 'String'>
    readonly deviceType: FieldRef<"UserSession", 'Device'>
    readonly countryCode: FieldRef<"UserSession", 'String'>
    readonly region: FieldRef<"UserSession", 'String'>
    readonly city: FieldRef<"UserSession", 'String'>
    readonly startedAt: FieldRef<"UserSession", 'DateTime'>
    readonly lastActiveAt: FieldRef<"UserSession", 'DateTime'>
    readonly endedAt: FieldRef<"UserSession", 'DateTime'>
    readonly pageViews: FieldRef<"UserSession", 'Int'>
    readonly eventsCount: FieldRef<"UserSession", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
  }

  /**
   * UserSession updateManyAndReturn
   */
  export type UserSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to delete.
     */
    limit?: number
  }

  /**
   * UserSession.user
   */
  export type UserSession$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * UserSession.events
   */
  export type UserSession$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    where?: AnalyticsEventWhereInput
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    cursor?: AnalyticsEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * UserSession.pageViewsRel
   */
  export type UserSession$pageViewsRelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    where?: PageViewWhereInput
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    cursor?: PageViewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * UserSession.chatSessions
   */
  export type UserSession$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    where?: ChatAnalyticsWhereInput
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    cursor?: ChatAnalyticsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatAnalyticsScalarFieldEnum | ChatAnalyticsScalarFieldEnum[]
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model AnalyticsEvent
   */

  export type AggregateAnalyticsEvent = {
    _count: AnalyticsEventCountAggregateOutputType | null
    _avg: AnalyticsEventAvgAggregateOutputType | null
    _sum: AnalyticsEventSumAggregateOutputType | null
    _min: AnalyticsEventMinAggregateOutputType | null
    _max: AnalyticsEventMaxAggregateOutputType | null
  }

  export type AnalyticsEventAvgAggregateOutputType = {
    eventValue: Decimal | null
  }

  export type AnalyticsEventSumAggregateOutputType = {
    eventValue: Decimal | null
  }

  export type AnalyticsEventMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    eventType: string | null
    eventAction: string | null
    eventCategory: string | null
    eventLabel: string | null
    eventValue: Decimal | null
    pagePath: string | null
    elementId: string | null
    elementType: string | null
    timestamp: Date | null
  }

  export type AnalyticsEventMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    eventType: string | null
    eventAction: string | null
    eventCategory: string | null
    eventLabel: string | null
    eventValue: Decimal | null
    pagePath: string | null
    elementId: string | null
    elementType: string | null
    timestamp: Date | null
  }

  export type AnalyticsEventCountAggregateOutputType = {
    id: number
    sessionId: number
    userId: number
    eventType: number
    eventAction: number
    eventCategory: number
    eventLabel: number
    eventValue: number
    pagePath: number
    elementId: number
    elementType: number
    metadata: number
    timestamp: number
    _all: number
  }


  export type AnalyticsEventAvgAggregateInputType = {
    eventValue?: true
  }

  export type AnalyticsEventSumAggregateInputType = {
    eventValue?: true
  }

  export type AnalyticsEventMinAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    eventType?: true
    eventAction?: true
    eventCategory?: true
    eventLabel?: true
    eventValue?: true
    pagePath?: true
    elementId?: true
    elementType?: true
    timestamp?: true
  }

  export type AnalyticsEventMaxAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    eventType?: true
    eventAction?: true
    eventCategory?: true
    eventLabel?: true
    eventValue?: true
    pagePath?: true
    elementId?: true
    elementType?: true
    timestamp?: true
  }

  export type AnalyticsEventCountAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    eventType?: true
    eventAction?: true
    eventCategory?: true
    eventLabel?: true
    eventValue?: true
    pagePath?: true
    elementId?: true
    elementType?: true
    metadata?: true
    timestamp?: true
    _all?: true
  }

  export type AnalyticsEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsEvent to aggregate.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalyticsEvents
    **/
    _count?: true | AnalyticsEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalyticsEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalyticsEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalyticsEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalyticsEventMaxAggregateInputType
  }

  export type GetAnalyticsEventAggregateType<T extends AnalyticsEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalyticsEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalyticsEvent[P]>
      : GetScalarType<T[P], AggregateAnalyticsEvent[P]>
  }




  export type AnalyticsEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalyticsEventWhereInput
    orderBy?: AnalyticsEventOrderByWithAggregationInput | AnalyticsEventOrderByWithAggregationInput[]
    by: AnalyticsEventScalarFieldEnum[] | AnalyticsEventScalarFieldEnum
    having?: AnalyticsEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalyticsEventCountAggregateInputType | true
    _avg?: AnalyticsEventAvgAggregateInputType
    _sum?: AnalyticsEventSumAggregateInputType
    _min?: AnalyticsEventMinAggregateInputType
    _max?: AnalyticsEventMaxAggregateInputType
  }

  export type AnalyticsEventGroupByOutputType = {
    id: string
    sessionId: string
    userId: string | null
    eventType: string
    eventAction: string
    eventCategory: string | null
    eventLabel: string | null
    eventValue: Decimal | null
    pagePath: string | null
    elementId: string | null
    elementType: string | null
    metadata: JsonValue | null
    timestamp: Date
    _count: AnalyticsEventCountAggregateOutputType | null
    _avg: AnalyticsEventAvgAggregateOutputType | null
    _sum: AnalyticsEventSumAggregateOutputType | null
    _min: AnalyticsEventMinAggregateOutputType | null
    _max: AnalyticsEventMaxAggregateOutputType | null
  }

  type GetAnalyticsEventGroupByPayload<T extends AnalyticsEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalyticsEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalyticsEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalyticsEventGroupByOutputType[P]>
            : GetScalarType<T[P], AnalyticsEventGroupByOutputType[P]>
        }
      >
    >


  export type AnalyticsEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    eventType?: boolean
    eventAction?: boolean
    eventCategory?: boolean
    eventLabel?: boolean
    eventValue?: boolean
    pagePath?: boolean
    elementId?: boolean
    elementType?: boolean
    metadata?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }, ExtArgs["result"]["analyticsEvent"]>

  export type AnalyticsEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    eventType?: boolean
    eventAction?: boolean
    eventCategory?: boolean
    eventLabel?: boolean
    eventValue?: boolean
    pagePath?: boolean
    elementId?: boolean
    elementType?: boolean
    metadata?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }, ExtArgs["result"]["analyticsEvent"]>

  export type AnalyticsEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    eventType?: boolean
    eventAction?: boolean
    eventCategory?: boolean
    eventLabel?: boolean
    eventValue?: boolean
    pagePath?: boolean
    elementId?: boolean
    elementType?: boolean
    metadata?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }, ExtArgs["result"]["analyticsEvent"]>

  export type AnalyticsEventSelectScalar = {
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    eventType?: boolean
    eventAction?: boolean
    eventCategory?: boolean
    eventLabel?: boolean
    eventValue?: boolean
    pagePath?: boolean
    elementId?: boolean
    elementType?: boolean
    metadata?: boolean
    timestamp?: boolean
  }

  export type AnalyticsEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "userId" | "eventType" | "eventAction" | "eventCategory" | "eventLabel" | "eventValue" | "pagePath" | "elementId" | "elementType" | "metadata" | "timestamp", ExtArgs["result"]["analyticsEvent"]>
  export type AnalyticsEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }
  export type AnalyticsEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }
  export type AnalyticsEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | AnalyticsEvent$userArgs<ExtArgs>
  }

  export type $AnalyticsEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalyticsEvent"
    objects: {
      session: Prisma.$UserSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique event identifier
       */
      id: string
      /**
       * Session this event belongs to
       */
      sessionId: string
      /**
       * User who triggered event (null for anonymous)
       */
      userId: string | null
      /**
       * Type of event (click, view, scroll, etc.)
       */
      eventType: string
      /**
       * Specific action taken
       */
      eventAction: string
      /**
       * Event category for grouping
       */
      eventCategory: string | null
      /**
       * Additional event descriptor
       */
      eventLabel: string | null
      /**
       * Numeric value associated with event
       */
      eventValue: Prisma.Decimal | null
      /**
       * Page where event occurred
       */
      pagePath: string | null
      /**
       * DOM element ID that triggered event
       */
      elementId: string | null
      /**
       * Type of element (button, link, etc.)
       */
      elementType: string | null
      /**
       * Additional event data
       */
      metadata: Prisma.JsonValue | null
      /**
       * Event timestamp
       */
      timestamp: Date
    }, ExtArgs["result"]["analyticsEvent"]>
    composites: {}
  }

  type AnalyticsEventGetPayload<S extends boolean | null | undefined | AnalyticsEventDefaultArgs> = $Result.GetResult<Prisma.$AnalyticsEventPayload, S>

  type AnalyticsEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalyticsEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalyticsEventCountAggregateInputType | true
    }

  export interface AnalyticsEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalyticsEvent'], meta: { name: 'AnalyticsEvent' } }
    /**
     * Find zero or one AnalyticsEvent that matches the filter.
     * @param {AnalyticsEventFindUniqueArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalyticsEventFindUniqueArgs>(args: SelectSubset<T, AnalyticsEventFindUniqueArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalyticsEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalyticsEventFindUniqueOrThrowArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalyticsEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalyticsEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalyticsEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindFirstArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalyticsEventFindFirstArgs>(args?: SelectSubset<T, AnalyticsEventFindFirstArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalyticsEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindFirstOrThrowArgs} args - Arguments to find a AnalyticsEvent
     * @example
     * // Get one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalyticsEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalyticsEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalyticsEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalyticsEvents
     * const analyticsEvents = await prisma.analyticsEvent.findMany()
     * 
     * // Get first 10 AnalyticsEvents
     * const analyticsEvents = await prisma.analyticsEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analyticsEventWithIdOnly = await prisma.analyticsEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalyticsEventFindManyArgs>(args?: SelectSubset<T, AnalyticsEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalyticsEvent.
     * @param {AnalyticsEventCreateArgs} args - Arguments to create a AnalyticsEvent.
     * @example
     * // Create one AnalyticsEvent
     * const AnalyticsEvent = await prisma.analyticsEvent.create({
     *   data: {
     *     // ... data to create a AnalyticsEvent
     *   }
     * })
     * 
     */
    create<T extends AnalyticsEventCreateArgs>(args: SelectSubset<T, AnalyticsEventCreateArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalyticsEvents.
     * @param {AnalyticsEventCreateManyArgs} args - Arguments to create many AnalyticsEvents.
     * @example
     * // Create many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalyticsEventCreateManyArgs>(args?: SelectSubset<T, AnalyticsEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalyticsEvents and returns the data saved in the database.
     * @param {AnalyticsEventCreateManyAndReturnArgs} args - Arguments to create many AnalyticsEvents.
     * @example
     * // Create many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalyticsEvents and only return the `id`
     * const analyticsEventWithIdOnly = await prisma.analyticsEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalyticsEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalyticsEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalyticsEvent.
     * @param {AnalyticsEventDeleteArgs} args - Arguments to delete one AnalyticsEvent.
     * @example
     * // Delete one AnalyticsEvent
     * const AnalyticsEvent = await prisma.analyticsEvent.delete({
     *   where: {
     *     // ... filter to delete one AnalyticsEvent
     *   }
     * })
     * 
     */
    delete<T extends AnalyticsEventDeleteArgs>(args: SelectSubset<T, AnalyticsEventDeleteArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalyticsEvent.
     * @param {AnalyticsEventUpdateArgs} args - Arguments to update one AnalyticsEvent.
     * @example
     * // Update one AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalyticsEventUpdateArgs>(args: SelectSubset<T, AnalyticsEventUpdateArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalyticsEvents.
     * @param {AnalyticsEventDeleteManyArgs} args - Arguments to filter AnalyticsEvents to delete.
     * @example
     * // Delete a few AnalyticsEvents
     * const { count } = await prisma.analyticsEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalyticsEventDeleteManyArgs>(args?: SelectSubset<T, AnalyticsEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalyticsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalyticsEventUpdateManyArgs>(args: SelectSubset<T, AnalyticsEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalyticsEvents and returns the data updated in the database.
     * @param {AnalyticsEventUpdateManyAndReturnArgs} args - Arguments to update many AnalyticsEvents.
     * @example
     * // Update many AnalyticsEvents
     * const analyticsEvent = await prisma.analyticsEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalyticsEvents and only return the `id`
     * const analyticsEventWithIdOnly = await prisma.analyticsEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalyticsEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalyticsEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalyticsEvent.
     * @param {AnalyticsEventUpsertArgs} args - Arguments to update or create a AnalyticsEvent.
     * @example
     * // Update or create a AnalyticsEvent
     * const analyticsEvent = await prisma.analyticsEvent.upsert({
     *   create: {
     *     // ... data to create a AnalyticsEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalyticsEvent we want to update
     *   }
     * })
     */
    upsert<T extends AnalyticsEventUpsertArgs>(args: SelectSubset<T, AnalyticsEventUpsertArgs<ExtArgs>>): Prisma__AnalyticsEventClient<$Result.GetResult<Prisma.$AnalyticsEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalyticsEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventCountArgs} args - Arguments to filter AnalyticsEvents to count.
     * @example
     * // Count the number of AnalyticsEvents
     * const count = await prisma.analyticsEvent.count({
     *   where: {
     *     // ... the filter for the AnalyticsEvents we want to count
     *   }
     * })
    **/
    count<T extends AnalyticsEventCountArgs>(
      args?: Subset<T, AnalyticsEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalyticsEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalyticsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalyticsEventAggregateArgs>(args: Subset<T, AnalyticsEventAggregateArgs>): Prisma.PrismaPromise<GetAnalyticsEventAggregateType<T>>

    /**
     * Group by AnalyticsEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalyticsEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalyticsEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalyticsEventGroupByArgs['orderBy'] }
        : { orderBy?: AnalyticsEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalyticsEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalyticsEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalyticsEvent model
   */
  readonly fields: AnalyticsEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalyticsEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalyticsEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends UserSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserSessionDefaultArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends AnalyticsEvent$userArgs<ExtArgs> = {}>(args?: Subset<T, AnalyticsEvent$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalyticsEvent model
   */
  interface AnalyticsEventFieldRefs {
    readonly id: FieldRef<"AnalyticsEvent", 'String'>
    readonly sessionId: FieldRef<"AnalyticsEvent", 'String'>
    readonly userId: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventType: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventAction: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventCategory: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventLabel: FieldRef<"AnalyticsEvent", 'String'>
    readonly eventValue: FieldRef<"AnalyticsEvent", 'Decimal'>
    readonly pagePath: FieldRef<"AnalyticsEvent", 'String'>
    readonly elementId: FieldRef<"AnalyticsEvent", 'String'>
    readonly elementType: FieldRef<"AnalyticsEvent", 'String'>
    readonly metadata: FieldRef<"AnalyticsEvent", 'Json'>
    readonly timestamp: FieldRef<"AnalyticsEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnalyticsEvent findUnique
   */
  export type AnalyticsEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent findUniqueOrThrow
   */
  export type AnalyticsEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent findFirst
   */
  export type AnalyticsEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsEvents.
     */
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent findFirstOrThrow
   */
  export type AnalyticsEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvent to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalyticsEvents.
     */
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent findMany
   */
  export type AnalyticsEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter, which AnalyticsEvents to fetch.
     */
    where?: AnalyticsEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalyticsEvents to fetch.
     */
    orderBy?: AnalyticsEventOrderByWithRelationInput | AnalyticsEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalyticsEvents.
     */
    cursor?: AnalyticsEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalyticsEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalyticsEvents.
     */
    skip?: number
    distinct?: AnalyticsEventScalarFieldEnum | AnalyticsEventScalarFieldEnum[]
  }

  /**
   * AnalyticsEvent create
   */
  export type AnalyticsEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalyticsEvent.
     */
    data: XOR<AnalyticsEventCreateInput, AnalyticsEventUncheckedCreateInput>
  }

  /**
   * AnalyticsEvent createMany
   */
  export type AnalyticsEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalyticsEvents.
     */
    data: AnalyticsEventCreateManyInput | AnalyticsEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalyticsEvent createManyAndReturn
   */
  export type AnalyticsEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * The data used to create many AnalyticsEvents.
     */
    data: AnalyticsEventCreateManyInput | AnalyticsEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalyticsEvent update
   */
  export type AnalyticsEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalyticsEvent.
     */
    data: XOR<AnalyticsEventUpdateInput, AnalyticsEventUncheckedUpdateInput>
    /**
     * Choose, which AnalyticsEvent to update.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent updateMany
   */
  export type AnalyticsEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalyticsEvents.
     */
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyInput>
    /**
     * Filter which AnalyticsEvents to update
     */
    where?: AnalyticsEventWhereInput
    /**
     * Limit how many AnalyticsEvents to update.
     */
    limit?: number
  }

  /**
   * AnalyticsEvent updateManyAndReturn
   */
  export type AnalyticsEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * The data used to update AnalyticsEvents.
     */
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyInput>
    /**
     * Filter which AnalyticsEvents to update
     */
    where?: AnalyticsEventWhereInput
    /**
     * Limit how many AnalyticsEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalyticsEvent upsert
   */
  export type AnalyticsEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalyticsEvent to update in case it exists.
     */
    where: AnalyticsEventWhereUniqueInput
    /**
     * In case the AnalyticsEvent found by the `where` argument doesn't exist, create a new AnalyticsEvent with this data.
     */
    create: XOR<AnalyticsEventCreateInput, AnalyticsEventUncheckedCreateInput>
    /**
     * In case the AnalyticsEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalyticsEventUpdateInput, AnalyticsEventUncheckedUpdateInput>
  }

  /**
   * AnalyticsEvent delete
   */
  export type AnalyticsEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
    /**
     * Filter which AnalyticsEvent to delete.
     */
    where: AnalyticsEventWhereUniqueInput
  }

  /**
   * AnalyticsEvent deleteMany
   */
  export type AnalyticsEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalyticsEvents to delete
     */
    where?: AnalyticsEventWhereInput
    /**
     * Limit how many AnalyticsEvents to delete.
     */
    limit?: number
  }

  /**
   * AnalyticsEvent.user
   */
  export type AnalyticsEvent$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AnalyticsEvent without action
   */
  export type AnalyticsEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalyticsEvent
     */
    select?: AnalyticsEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalyticsEvent
     */
    omit?: AnalyticsEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalyticsEventInclude<ExtArgs> | null
  }


  /**
   * Model PageView
   */

  export type AggregatePageView = {
    _count: PageViewCountAggregateOutputType | null
    _avg: PageViewAvgAggregateOutputType | null
    _sum: PageViewSumAggregateOutputType | null
    _min: PageViewMinAggregateOutputType | null
    _max: PageViewMaxAggregateOutputType | null
  }

  export type PageViewAvgAggregateOutputType = {
    timeOnPage: number | null
    scrollDepth: number | null
  }

  export type PageViewSumAggregateOutputType = {
    timeOnPage: number | null
    scrollDepth: number | null
  }

  export type PageViewMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    pagePath: string | null
    pageTitle: string | null
    referrer: string | null
    timeOnPage: number | null
    scrollDepth: number | null
    exitPage: boolean | null
    bounce: boolean | null
    timestamp: Date | null
  }

  export type PageViewMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    pagePath: string | null
    pageTitle: string | null
    referrer: string | null
    timeOnPage: number | null
    scrollDepth: number | null
    exitPage: boolean | null
    bounce: boolean | null
    timestamp: Date | null
  }

  export type PageViewCountAggregateOutputType = {
    id: number
    sessionId: number
    userId: number
    pagePath: number
    pageTitle: number
    referrer: number
    timeOnPage: number
    scrollDepth: number
    exitPage: number
    bounce: number
    timestamp: number
    _all: number
  }


  export type PageViewAvgAggregateInputType = {
    timeOnPage?: true
    scrollDepth?: true
  }

  export type PageViewSumAggregateInputType = {
    timeOnPage?: true
    scrollDepth?: true
  }

  export type PageViewMinAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    pagePath?: true
    pageTitle?: true
    referrer?: true
    timeOnPage?: true
    scrollDepth?: true
    exitPage?: true
    bounce?: true
    timestamp?: true
  }

  export type PageViewMaxAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    pagePath?: true
    pageTitle?: true
    referrer?: true
    timeOnPage?: true
    scrollDepth?: true
    exitPage?: true
    bounce?: true
    timestamp?: true
  }

  export type PageViewCountAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    pagePath?: true
    pageTitle?: true
    referrer?: true
    timeOnPage?: true
    scrollDepth?: true
    exitPage?: true
    bounce?: true
    timestamp?: true
    _all?: true
  }

  export type PageViewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageView to aggregate.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PageViews
    **/
    _count?: true | PageViewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PageViewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PageViewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PageViewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PageViewMaxAggregateInputType
  }

  export type GetPageViewAggregateType<T extends PageViewAggregateArgs> = {
        [P in keyof T & keyof AggregatePageView]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePageView[P]>
      : GetScalarType<T[P], AggregatePageView[P]>
  }




  export type PageViewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageViewWhereInput
    orderBy?: PageViewOrderByWithAggregationInput | PageViewOrderByWithAggregationInput[]
    by: PageViewScalarFieldEnum[] | PageViewScalarFieldEnum
    having?: PageViewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PageViewCountAggregateInputType | true
    _avg?: PageViewAvgAggregateInputType
    _sum?: PageViewSumAggregateInputType
    _min?: PageViewMinAggregateInputType
    _max?: PageViewMaxAggregateInputType
  }

  export type PageViewGroupByOutputType = {
    id: string
    sessionId: string
    userId: string | null
    pagePath: string
    pageTitle: string | null
    referrer: string | null
    timeOnPage: number | null
    scrollDepth: number | null
    exitPage: boolean
    bounce: boolean
    timestamp: Date
    _count: PageViewCountAggregateOutputType | null
    _avg: PageViewAvgAggregateOutputType | null
    _sum: PageViewSumAggregateOutputType | null
    _min: PageViewMinAggregateOutputType | null
    _max: PageViewMaxAggregateOutputType | null
  }

  type GetPageViewGroupByPayload<T extends PageViewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PageViewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PageViewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PageViewGroupByOutputType[P]>
            : GetScalarType<T[P], PageViewGroupByOutputType[P]>
        }
      >
    >


  export type PageViewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    pagePath?: boolean
    pageTitle?: boolean
    referrer?: boolean
    timeOnPage?: boolean
    scrollDepth?: boolean
    exitPage?: boolean
    bounce?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    pagePath?: boolean
    pageTitle?: boolean
    referrer?: boolean
    timeOnPage?: boolean
    scrollDepth?: boolean
    exitPage?: boolean
    bounce?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    pagePath?: boolean
    pageTitle?: boolean
    referrer?: boolean
    timeOnPage?: boolean
    scrollDepth?: boolean
    exitPage?: boolean
    bounce?: boolean
    timestamp?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }, ExtArgs["result"]["pageView"]>

  export type PageViewSelectScalar = {
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    pagePath?: boolean
    pageTitle?: boolean
    referrer?: boolean
    timeOnPage?: boolean
    scrollDepth?: boolean
    exitPage?: boolean
    bounce?: boolean
    timestamp?: boolean
  }

  export type PageViewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "userId" | "pagePath" | "pageTitle" | "referrer" | "timeOnPage" | "scrollDepth" | "exitPage" | "bounce" | "timestamp", ExtArgs["result"]["pageView"]>
  export type PageViewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }
  export type PageViewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }
  export type PageViewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | PageView$userArgs<ExtArgs>
  }

  export type $PageViewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PageView"
    objects: {
      session: Prisma.$UserSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique page view identifier
       */
      id: string
      /**
       * Session this page view belongs to
       */
      sessionId: string
      /**
       * User who viewed page (null for anonymous)
       */
      userId: string | null
      /**
       * Full page path/URL
       */
      pagePath: string
      /**
       * Page title
       */
      pageTitle: string | null
      /**
       * Referring page/source
       */
      referrer: string | null
      /**
       * Time spent on page (seconds)
       */
      timeOnPage: number | null
      /**
       * Maximum scroll depth (percentage)
       */
      scrollDepth: number | null
      /**
       * Whether user exited from this page
       */
      exitPage: boolean
      /**
       * Whether this was a bounce (single page session)
       */
      bounce: boolean
      /**
       * Page view timestamp
       */
      timestamp: Date
    }, ExtArgs["result"]["pageView"]>
    composites: {}
  }

  type PageViewGetPayload<S extends boolean | null | undefined | PageViewDefaultArgs> = $Result.GetResult<Prisma.$PageViewPayload, S>

  type PageViewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PageViewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PageViewCountAggregateInputType | true
    }

  export interface PageViewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PageView'], meta: { name: 'PageView' } }
    /**
     * Find zero or one PageView that matches the filter.
     * @param {PageViewFindUniqueArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PageViewFindUniqueArgs>(args: SelectSubset<T, PageViewFindUniqueArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PageView that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PageViewFindUniqueOrThrowArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PageViewFindUniqueOrThrowArgs>(args: SelectSubset<T, PageViewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PageView that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindFirstArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PageViewFindFirstArgs>(args?: SelectSubset<T, PageViewFindFirstArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PageView that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindFirstOrThrowArgs} args - Arguments to find a PageView
     * @example
     * // Get one PageView
     * const pageView = await prisma.pageView.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PageViewFindFirstOrThrowArgs>(args?: SelectSubset<T, PageViewFindFirstOrThrowArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PageViews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PageViews
     * const pageViews = await prisma.pageView.findMany()
     * 
     * // Get first 10 PageViews
     * const pageViews = await prisma.pageView.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pageViewWithIdOnly = await prisma.pageView.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PageViewFindManyArgs>(args?: SelectSubset<T, PageViewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PageView.
     * @param {PageViewCreateArgs} args - Arguments to create a PageView.
     * @example
     * // Create one PageView
     * const PageView = await prisma.pageView.create({
     *   data: {
     *     // ... data to create a PageView
     *   }
     * })
     * 
     */
    create<T extends PageViewCreateArgs>(args: SelectSubset<T, PageViewCreateArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PageViews.
     * @param {PageViewCreateManyArgs} args - Arguments to create many PageViews.
     * @example
     * // Create many PageViews
     * const pageView = await prisma.pageView.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PageViewCreateManyArgs>(args?: SelectSubset<T, PageViewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PageViews and returns the data saved in the database.
     * @param {PageViewCreateManyAndReturnArgs} args - Arguments to create many PageViews.
     * @example
     * // Create many PageViews
     * const pageView = await prisma.pageView.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PageViews and only return the `id`
     * const pageViewWithIdOnly = await prisma.pageView.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PageViewCreateManyAndReturnArgs>(args?: SelectSubset<T, PageViewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PageView.
     * @param {PageViewDeleteArgs} args - Arguments to delete one PageView.
     * @example
     * // Delete one PageView
     * const PageView = await prisma.pageView.delete({
     *   where: {
     *     // ... filter to delete one PageView
     *   }
     * })
     * 
     */
    delete<T extends PageViewDeleteArgs>(args: SelectSubset<T, PageViewDeleteArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PageView.
     * @param {PageViewUpdateArgs} args - Arguments to update one PageView.
     * @example
     * // Update one PageView
     * const pageView = await prisma.pageView.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PageViewUpdateArgs>(args: SelectSubset<T, PageViewUpdateArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PageViews.
     * @param {PageViewDeleteManyArgs} args - Arguments to filter PageViews to delete.
     * @example
     * // Delete a few PageViews
     * const { count } = await prisma.pageView.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PageViewDeleteManyArgs>(args?: SelectSubset<T, PageViewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PageViews
     * const pageView = await prisma.pageView.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PageViewUpdateManyArgs>(args: SelectSubset<T, PageViewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageViews and returns the data updated in the database.
     * @param {PageViewUpdateManyAndReturnArgs} args - Arguments to update many PageViews.
     * @example
     * // Update many PageViews
     * const pageView = await prisma.pageView.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PageViews and only return the `id`
     * const pageViewWithIdOnly = await prisma.pageView.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PageViewUpdateManyAndReturnArgs>(args: SelectSubset<T, PageViewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PageView.
     * @param {PageViewUpsertArgs} args - Arguments to update or create a PageView.
     * @example
     * // Update or create a PageView
     * const pageView = await prisma.pageView.upsert({
     *   create: {
     *     // ... data to create a PageView
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PageView we want to update
     *   }
     * })
     */
    upsert<T extends PageViewUpsertArgs>(args: SelectSubset<T, PageViewUpsertArgs<ExtArgs>>): Prisma__PageViewClient<$Result.GetResult<Prisma.$PageViewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PageViews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewCountArgs} args - Arguments to filter PageViews to count.
     * @example
     * // Count the number of PageViews
     * const count = await prisma.pageView.count({
     *   where: {
     *     // ... the filter for the PageViews we want to count
     *   }
     * })
    **/
    count<T extends PageViewCountArgs>(
      args?: Subset<T, PageViewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PageViewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PageView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PageViewAggregateArgs>(args: Subset<T, PageViewAggregateArgs>): Prisma.PrismaPromise<GetPageViewAggregateType<T>>

    /**
     * Group by PageView.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageViewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PageViewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PageViewGroupByArgs['orderBy'] }
        : { orderBy?: PageViewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PageViewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageViewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PageView model
   */
  readonly fields: PageViewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PageView.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PageViewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends UserSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserSessionDefaultArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends PageView$userArgs<ExtArgs> = {}>(args?: Subset<T, PageView$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PageView model
   */
  interface PageViewFieldRefs {
    readonly id: FieldRef<"PageView", 'String'>
    readonly sessionId: FieldRef<"PageView", 'String'>
    readonly userId: FieldRef<"PageView", 'String'>
    readonly pagePath: FieldRef<"PageView", 'String'>
    readonly pageTitle: FieldRef<"PageView", 'String'>
    readonly referrer: FieldRef<"PageView", 'String'>
    readonly timeOnPage: FieldRef<"PageView", 'Int'>
    readonly scrollDepth: FieldRef<"PageView", 'Int'>
    readonly exitPage: FieldRef<"PageView", 'Boolean'>
    readonly bounce: FieldRef<"PageView", 'Boolean'>
    readonly timestamp: FieldRef<"PageView", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PageView findUnique
   */
  export type PageViewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView findUniqueOrThrow
   */
  export type PageViewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView findFirst
   */
  export type PageViewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageViews.
     */
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView findFirstOrThrow
   */
  export type PageViewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageView to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageViews.
     */
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView findMany
   */
  export type PageViewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter, which PageViews to fetch.
     */
    where?: PageViewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageViews to fetch.
     */
    orderBy?: PageViewOrderByWithRelationInput | PageViewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PageViews.
     */
    cursor?: PageViewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageViews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageViews.
     */
    skip?: number
    distinct?: PageViewScalarFieldEnum | PageViewScalarFieldEnum[]
  }

  /**
   * PageView create
   */
  export type PageViewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The data needed to create a PageView.
     */
    data: XOR<PageViewCreateInput, PageViewUncheckedCreateInput>
  }

  /**
   * PageView createMany
   */
  export type PageViewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PageViews.
     */
    data: PageViewCreateManyInput | PageViewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PageView createManyAndReturn
   */
  export type PageViewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * The data used to create many PageViews.
     */
    data: PageViewCreateManyInput | PageViewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PageView update
   */
  export type PageViewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The data needed to update a PageView.
     */
    data: XOR<PageViewUpdateInput, PageViewUncheckedUpdateInput>
    /**
     * Choose, which PageView to update.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView updateMany
   */
  export type PageViewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PageViews.
     */
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyInput>
    /**
     * Filter which PageViews to update
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to update.
     */
    limit?: number
  }

  /**
   * PageView updateManyAndReturn
   */
  export type PageViewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * The data used to update PageViews.
     */
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyInput>
    /**
     * Filter which PageViews to update
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PageView upsert
   */
  export type PageViewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * The filter to search for the PageView to update in case it exists.
     */
    where: PageViewWhereUniqueInput
    /**
     * In case the PageView found by the `where` argument doesn't exist, create a new PageView with this data.
     */
    create: XOR<PageViewCreateInput, PageViewUncheckedCreateInput>
    /**
     * In case the PageView was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PageViewUpdateInput, PageViewUncheckedUpdateInput>
  }

  /**
   * PageView delete
   */
  export type PageViewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
    /**
     * Filter which PageView to delete.
     */
    where: PageViewWhereUniqueInput
  }

  /**
   * PageView deleteMany
   */
  export type PageViewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageViews to delete
     */
    where?: PageViewWhereInput
    /**
     * Limit how many PageViews to delete.
     */
    limit?: number
  }

  /**
   * PageView.user
   */
  export type PageView$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PageView without action
   */
  export type PageViewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageView
     */
    select?: PageViewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PageView
     */
    omit?: PageViewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageViewInclude<ExtArgs> | null
  }


  /**
   * Model ChatAnalytics
   */

  export type AggregateChatAnalytics = {
    _count: ChatAnalyticsCountAggregateOutputType | null
    _avg: ChatAnalyticsAvgAggregateOutputType | null
    _sum: ChatAnalyticsSumAggregateOutputType | null
    _min: ChatAnalyticsMinAggregateOutputType | null
    _max: ChatAnalyticsMaxAggregateOutputType | null
  }

  export type ChatAnalyticsAvgAggregateOutputType = {
    messageCount: number | null
    sessionDuration: number | null
    tokensUsed: number | null
    errorCount: number | null
  }

  export type ChatAnalyticsSumAggregateOutputType = {
    messageCount: number | null
    sessionDuration: number | null
    tokensUsed: number | null
    errorCount: number | null
  }

  export type ChatAnalyticsMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    conversationId: string | null
    messageCount: number | null
    sessionDuration: number | null
    selectedArticle: string | null
    selectedContentType: string | null
    tokensUsed: number | null
    errorCount: number | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type ChatAnalyticsMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    conversationId: string | null
    messageCount: number | null
    sessionDuration: number | null
    selectedArticle: string | null
    selectedContentType: string | null
    tokensUsed: number | null
    errorCount: number | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type ChatAnalyticsCountAggregateOutputType = {
    id: number
    sessionId: number
    userId: number
    conversationId: number
    messageCount: number
    sessionDuration: number
    selectedArticle: number
    selectedContentType: number
    tokensUsed: number
    errorCount: number
    startedAt: number
    endedAt: number
    _all: number
  }


  export type ChatAnalyticsAvgAggregateInputType = {
    messageCount?: true
    sessionDuration?: true
    tokensUsed?: true
    errorCount?: true
  }

  export type ChatAnalyticsSumAggregateInputType = {
    messageCount?: true
    sessionDuration?: true
    tokensUsed?: true
    errorCount?: true
  }

  export type ChatAnalyticsMinAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    conversationId?: true
    messageCount?: true
    sessionDuration?: true
    selectedArticle?: true
    selectedContentType?: true
    tokensUsed?: true
    errorCount?: true
    startedAt?: true
    endedAt?: true
  }

  export type ChatAnalyticsMaxAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    conversationId?: true
    messageCount?: true
    sessionDuration?: true
    selectedArticle?: true
    selectedContentType?: true
    tokensUsed?: true
    errorCount?: true
    startedAt?: true
    endedAt?: true
  }

  export type ChatAnalyticsCountAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    conversationId?: true
    messageCount?: true
    sessionDuration?: true
    selectedArticle?: true
    selectedContentType?: true
    tokensUsed?: true
    errorCount?: true
    startedAt?: true
    endedAt?: true
    _all?: true
  }

  export type ChatAnalyticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatAnalytics to aggregate.
     */
    where?: ChatAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatAnalytics to fetch.
     */
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatAnalytics
    **/
    _count?: true | ChatAnalyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatAnalyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatAnalyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatAnalyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatAnalyticsMaxAggregateInputType
  }

  export type GetChatAnalyticsAggregateType<T extends ChatAnalyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateChatAnalytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatAnalytics[P]>
      : GetScalarType<T[P], AggregateChatAnalytics[P]>
  }




  export type ChatAnalyticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatAnalyticsWhereInput
    orderBy?: ChatAnalyticsOrderByWithAggregationInput | ChatAnalyticsOrderByWithAggregationInput[]
    by: ChatAnalyticsScalarFieldEnum[] | ChatAnalyticsScalarFieldEnum
    having?: ChatAnalyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatAnalyticsCountAggregateInputType | true
    _avg?: ChatAnalyticsAvgAggregateInputType
    _sum?: ChatAnalyticsSumAggregateInputType
    _min?: ChatAnalyticsMinAggregateInputType
    _max?: ChatAnalyticsMaxAggregateInputType
  }

  export type ChatAnalyticsGroupByOutputType = {
    id: string
    sessionId: string
    userId: string | null
    conversationId: string
    messageCount: number
    sessionDuration: number | null
    selectedArticle: string | null
    selectedContentType: string | null
    tokensUsed: number | null
    errorCount: number
    startedAt: Date
    endedAt: Date | null
    _count: ChatAnalyticsCountAggregateOutputType | null
    _avg: ChatAnalyticsAvgAggregateOutputType | null
    _sum: ChatAnalyticsSumAggregateOutputType | null
    _min: ChatAnalyticsMinAggregateOutputType | null
    _max: ChatAnalyticsMaxAggregateOutputType | null
  }

  type GetChatAnalyticsGroupByPayload<T extends ChatAnalyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatAnalyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatAnalyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], ChatAnalyticsGroupByOutputType[P]>
        }
      >
    >


  export type ChatAnalyticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    conversationId?: boolean
    messageCount?: boolean
    sessionDuration?: boolean
    selectedArticle?: boolean
    selectedContentType?: boolean
    tokensUsed?: boolean
    errorCount?: boolean
    startedAt?: boolean
    endedAt?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }, ExtArgs["result"]["chatAnalytics"]>

  export type ChatAnalyticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    conversationId?: boolean
    messageCount?: boolean
    sessionDuration?: boolean
    selectedArticle?: boolean
    selectedContentType?: boolean
    tokensUsed?: boolean
    errorCount?: boolean
    startedAt?: boolean
    endedAt?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }, ExtArgs["result"]["chatAnalytics"]>

  export type ChatAnalyticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    conversationId?: boolean
    messageCount?: boolean
    sessionDuration?: boolean
    selectedArticle?: boolean
    selectedContentType?: boolean
    tokensUsed?: boolean
    errorCount?: boolean
    startedAt?: boolean
    endedAt?: boolean
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }, ExtArgs["result"]["chatAnalytics"]>

  export type ChatAnalyticsSelectScalar = {
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    conversationId?: boolean
    messageCount?: boolean
    sessionDuration?: boolean
    selectedArticle?: boolean
    selectedContentType?: boolean
    tokensUsed?: boolean
    errorCount?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }

  export type ChatAnalyticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "userId" | "conversationId" | "messageCount" | "sessionDuration" | "selectedArticle" | "selectedContentType" | "tokensUsed" | "errorCount" | "startedAt" | "endedAt", ExtArgs["result"]["chatAnalytics"]>
  export type ChatAnalyticsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }
  export type ChatAnalyticsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }
  export type ChatAnalyticsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UserSessionDefaultArgs<ExtArgs>
    user?: boolean | ChatAnalytics$userArgs<ExtArgs>
  }

  export type $ChatAnalyticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatAnalytics"
    objects: {
      session: Prisma.$UserSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique chat session identifier
       */
      id: string
      /**
       * User session this chat belongs to
       */
      sessionId: string
      /**
       * User who participated in chat (null for anonymous)
       */
      userId: string | null
      /**
       * Client-generated conversation ID
       */
      conversationId: string
      /**
       * Number of messages in conversation
       */
      messageCount: number
      /**
       * Chat session duration (seconds)
       */
      sessionDuration: number | null
      /**
       * Article context for chat
       */
      selectedArticle: string | null
      /**
       * Content type being discussed
       */
      selectedContentType: string | null
      /**
       * AI tokens consumed
       */
      tokensUsed: number | null
      /**
       * Number of errors in session
       */
      errorCount: number
      /**
       * Chat session start
       */
      startedAt: Date
      /**
       * Chat session end (null if active)
       */
      endedAt: Date | null
    }, ExtArgs["result"]["chatAnalytics"]>
    composites: {}
  }

  type ChatAnalyticsGetPayload<S extends boolean | null | undefined | ChatAnalyticsDefaultArgs> = $Result.GetResult<Prisma.$ChatAnalyticsPayload, S>

  type ChatAnalyticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatAnalyticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatAnalyticsCountAggregateInputType | true
    }

  export interface ChatAnalyticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatAnalytics'], meta: { name: 'ChatAnalytics' } }
    /**
     * Find zero or one ChatAnalytics that matches the filter.
     * @param {ChatAnalyticsFindUniqueArgs} args - Arguments to find a ChatAnalytics
     * @example
     * // Get one ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatAnalyticsFindUniqueArgs>(args: SelectSubset<T, ChatAnalyticsFindUniqueArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a ChatAnalytics
     * @example
     * // Get one ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatAnalyticsFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatAnalyticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsFindFirstArgs} args - Arguments to find a ChatAnalytics
     * @example
     * // Get one ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatAnalyticsFindFirstArgs>(args?: SelectSubset<T, ChatAnalyticsFindFirstArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsFindFirstOrThrowArgs} args - Arguments to find a ChatAnalytics
     * @example
     * // Get one ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatAnalyticsFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatAnalyticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findMany()
     * 
     * // Get first 10 ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatAnalyticsWithIdOnly = await prisma.chatAnalytics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatAnalyticsFindManyArgs>(args?: SelectSubset<T, ChatAnalyticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatAnalytics.
     * @param {ChatAnalyticsCreateArgs} args - Arguments to create a ChatAnalytics.
     * @example
     * // Create one ChatAnalytics
     * const ChatAnalytics = await prisma.chatAnalytics.create({
     *   data: {
     *     // ... data to create a ChatAnalytics
     *   }
     * })
     * 
     */
    create<T extends ChatAnalyticsCreateArgs>(args: SelectSubset<T, ChatAnalyticsCreateArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatAnalytics.
     * @param {ChatAnalyticsCreateManyArgs} args - Arguments to create many ChatAnalytics.
     * @example
     * // Create many ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatAnalyticsCreateManyArgs>(args?: SelectSubset<T, ChatAnalyticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatAnalytics and returns the data saved in the database.
     * @param {ChatAnalyticsCreateManyAndReturnArgs} args - Arguments to create many ChatAnalytics.
     * @example
     * // Create many ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatAnalytics and only return the `id`
     * const chatAnalyticsWithIdOnly = await prisma.chatAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatAnalyticsCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatAnalyticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatAnalytics.
     * @param {ChatAnalyticsDeleteArgs} args - Arguments to delete one ChatAnalytics.
     * @example
     * // Delete one ChatAnalytics
     * const ChatAnalytics = await prisma.chatAnalytics.delete({
     *   where: {
     *     // ... filter to delete one ChatAnalytics
     *   }
     * })
     * 
     */
    delete<T extends ChatAnalyticsDeleteArgs>(args: SelectSubset<T, ChatAnalyticsDeleteArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatAnalytics.
     * @param {ChatAnalyticsUpdateArgs} args - Arguments to update one ChatAnalytics.
     * @example
     * // Update one ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatAnalyticsUpdateArgs>(args: SelectSubset<T, ChatAnalyticsUpdateArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatAnalytics.
     * @param {ChatAnalyticsDeleteManyArgs} args - Arguments to filter ChatAnalytics to delete.
     * @example
     * // Delete a few ChatAnalytics
     * const { count } = await prisma.chatAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatAnalyticsDeleteManyArgs>(args?: SelectSubset<T, ChatAnalyticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatAnalyticsUpdateManyArgs>(args: SelectSubset<T, ChatAnalyticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatAnalytics and returns the data updated in the database.
     * @param {ChatAnalyticsUpdateManyAndReturnArgs} args - Arguments to update many ChatAnalytics.
     * @example
     * // Update many ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatAnalytics and only return the `id`
     * const chatAnalyticsWithIdOnly = await prisma.chatAnalytics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatAnalyticsUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatAnalyticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatAnalytics.
     * @param {ChatAnalyticsUpsertArgs} args - Arguments to update or create a ChatAnalytics.
     * @example
     * // Update or create a ChatAnalytics
     * const chatAnalytics = await prisma.chatAnalytics.upsert({
     *   create: {
     *     // ... data to create a ChatAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends ChatAnalyticsUpsertArgs>(args: SelectSubset<T, ChatAnalyticsUpsertArgs<ExtArgs>>): Prisma__ChatAnalyticsClient<$Result.GetResult<Prisma.$ChatAnalyticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsCountArgs} args - Arguments to filter ChatAnalytics to count.
     * @example
     * // Count the number of ChatAnalytics
     * const count = await prisma.chatAnalytics.count({
     *   where: {
     *     // ... the filter for the ChatAnalytics we want to count
     *   }
     * })
    **/
    count<T extends ChatAnalyticsCountArgs>(
      args?: Subset<T, ChatAnalyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatAnalyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatAnalyticsAggregateArgs>(args: Subset<T, ChatAnalyticsAggregateArgs>): Prisma.PrismaPromise<GetChatAnalyticsAggregateType<T>>

    /**
     * Group by ChatAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAnalyticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: ChatAnalyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatAnalyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatAnalyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatAnalytics model
   */
  readonly fields: ChatAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatAnalyticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends UserSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserSessionDefaultArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends ChatAnalytics$userArgs<ExtArgs> = {}>(args?: Subset<T, ChatAnalytics$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatAnalytics model
   */
  interface ChatAnalyticsFieldRefs {
    readonly id: FieldRef<"ChatAnalytics", 'String'>
    readonly sessionId: FieldRef<"ChatAnalytics", 'String'>
    readonly userId: FieldRef<"ChatAnalytics", 'String'>
    readonly conversationId: FieldRef<"ChatAnalytics", 'String'>
    readonly messageCount: FieldRef<"ChatAnalytics", 'Int'>
    readonly sessionDuration: FieldRef<"ChatAnalytics", 'Int'>
    readonly selectedArticle: FieldRef<"ChatAnalytics", 'String'>
    readonly selectedContentType: FieldRef<"ChatAnalytics", 'String'>
    readonly tokensUsed: FieldRef<"ChatAnalytics", 'Int'>
    readonly errorCount: FieldRef<"ChatAnalytics", 'Int'>
    readonly startedAt: FieldRef<"ChatAnalytics", 'DateTime'>
    readonly endedAt: FieldRef<"ChatAnalytics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatAnalytics findUnique
   */
  export type ChatAnalyticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which ChatAnalytics to fetch.
     */
    where: ChatAnalyticsWhereUniqueInput
  }

  /**
   * ChatAnalytics findUniqueOrThrow
   */
  export type ChatAnalyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which ChatAnalytics to fetch.
     */
    where: ChatAnalyticsWhereUniqueInput
  }

  /**
   * ChatAnalytics findFirst
   */
  export type ChatAnalyticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which ChatAnalytics to fetch.
     */
    where?: ChatAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatAnalytics to fetch.
     */
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatAnalytics.
     */
    cursor?: ChatAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatAnalytics.
     */
    distinct?: ChatAnalyticsScalarFieldEnum | ChatAnalyticsScalarFieldEnum[]
  }

  /**
   * ChatAnalytics findFirstOrThrow
   */
  export type ChatAnalyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which ChatAnalytics to fetch.
     */
    where?: ChatAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatAnalytics to fetch.
     */
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatAnalytics.
     */
    cursor?: ChatAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatAnalytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatAnalytics.
     */
    distinct?: ChatAnalyticsScalarFieldEnum | ChatAnalyticsScalarFieldEnum[]
  }

  /**
   * ChatAnalytics findMany
   */
  export type ChatAnalyticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter, which ChatAnalytics to fetch.
     */
    where?: ChatAnalyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatAnalytics to fetch.
     */
    orderBy?: ChatAnalyticsOrderByWithRelationInput | ChatAnalyticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatAnalytics.
     */
    cursor?: ChatAnalyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatAnalytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatAnalytics.
     */
    skip?: number
    distinct?: ChatAnalyticsScalarFieldEnum | ChatAnalyticsScalarFieldEnum[]
  }

  /**
   * ChatAnalytics create
   */
  export type ChatAnalyticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatAnalytics.
     */
    data: XOR<ChatAnalyticsCreateInput, ChatAnalyticsUncheckedCreateInput>
  }

  /**
   * ChatAnalytics createMany
   */
  export type ChatAnalyticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatAnalytics.
     */
    data: ChatAnalyticsCreateManyInput | ChatAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatAnalytics createManyAndReturn
   */
  export type ChatAnalyticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to create many ChatAnalytics.
     */
    data: ChatAnalyticsCreateManyInput | ChatAnalyticsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatAnalytics update
   */
  export type ChatAnalyticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatAnalytics.
     */
    data: XOR<ChatAnalyticsUpdateInput, ChatAnalyticsUncheckedUpdateInput>
    /**
     * Choose, which ChatAnalytics to update.
     */
    where: ChatAnalyticsWhereUniqueInput
  }

  /**
   * ChatAnalytics updateMany
   */
  export type ChatAnalyticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatAnalytics.
     */
    data: XOR<ChatAnalyticsUpdateManyMutationInput, ChatAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which ChatAnalytics to update
     */
    where?: ChatAnalyticsWhereInput
    /**
     * Limit how many ChatAnalytics to update.
     */
    limit?: number
  }

  /**
   * ChatAnalytics updateManyAndReturn
   */
  export type ChatAnalyticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * The data used to update ChatAnalytics.
     */
    data: XOR<ChatAnalyticsUpdateManyMutationInput, ChatAnalyticsUncheckedUpdateManyInput>
    /**
     * Filter which ChatAnalytics to update
     */
    where?: ChatAnalyticsWhereInput
    /**
     * Limit how many ChatAnalytics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatAnalytics upsert
   */
  export type ChatAnalyticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatAnalytics to update in case it exists.
     */
    where: ChatAnalyticsWhereUniqueInput
    /**
     * In case the ChatAnalytics found by the `where` argument doesn't exist, create a new ChatAnalytics with this data.
     */
    create: XOR<ChatAnalyticsCreateInput, ChatAnalyticsUncheckedCreateInput>
    /**
     * In case the ChatAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatAnalyticsUpdateInput, ChatAnalyticsUncheckedUpdateInput>
  }

  /**
   * ChatAnalytics delete
   */
  export type ChatAnalyticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
    /**
     * Filter which ChatAnalytics to delete.
     */
    where: ChatAnalyticsWhereUniqueInput
  }

  /**
   * ChatAnalytics deleteMany
   */
  export type ChatAnalyticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatAnalytics to delete
     */
    where?: ChatAnalyticsWhereInput
    /**
     * Limit how many ChatAnalytics to delete.
     */
    limit?: number
  }

  /**
   * ChatAnalytics.user
   */
  export type ChatAnalytics$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ChatAnalytics without action
   */
  export type ChatAnalyticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatAnalytics
     */
    select?: ChatAnalyticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatAnalytics
     */
    omit?: ChatAnalyticsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatAnalyticsInclude<ExtArgs> | null
  }


  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleAvgAggregateOutputType = {
    position: number | null
  }

  export type ArticleSumAggregateOutputType = {
    position: number | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    content: string | null
    contentType: string | null
    articleTopic: string | null
    category: string | null
    defaultVideoScript: string | null
    defaultEmailTemplate: string | null
    position: number | null
    imageUrl: string | null
    sourceUrl: string | null
    status: $Enums.ArticleStatus | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    createdByAdminId: string | null
    lastEditedByAdminId: string | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    content: string | null
    contentType: string | null
    articleTopic: string | null
    category: string | null
    defaultVideoScript: string | null
    defaultEmailTemplate: string | null
    position: number | null
    imageUrl: string | null
    sourceUrl: string | null
    status: $Enums.ArticleStatus | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    createdByAdminId: string | null
    lastEditedByAdminId: string | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    summary: number
    content: number
    contentType: number
    articleTopic: number
    category: number
    tags: number
    defaultKeyInsights: number
    defaultVideoScript: number
    defaultEmailTemplate: number
    defaultSocialContent: number
    position: number
    imageUrl: number
    sourceUrl: number
    metadata: number
    status: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    createdByAdminId: number
    lastEditedByAdminId: number
    _all: number
  }


  export type ArticleAvgAggregateInputType = {
    position?: true
  }

  export type ArticleSumAggregateInputType = {
    position?: true
  }

  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    content?: true
    contentType?: true
    articleTopic?: true
    category?: true
    defaultVideoScript?: true
    defaultEmailTemplate?: true
    position?: true
    imageUrl?: true
    sourceUrl?: true
    status?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    createdByAdminId?: true
    lastEditedByAdminId?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    content?: true
    contentType?: true
    articleTopic?: true
    category?: true
    defaultVideoScript?: true
    defaultEmailTemplate?: true
    position?: true
    imageUrl?: true
    sourceUrl?: true
    status?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    createdByAdminId?: true
    lastEditedByAdminId?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    content?: true
    contentType?: true
    articleTopic?: true
    category?: true
    tags?: true
    defaultKeyInsights?: true
    defaultVideoScript?: true
    defaultEmailTemplate?: true
    defaultSocialContent?: true
    position?: true
    imageUrl?: true
    sourceUrl?: true
    metadata?: true
    status?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    createdByAdminId?: true
    lastEditedByAdminId?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _avg?: ArticleAvgAggregateInputType
    _sum?: ArticleSumAggregateInputType
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    summary: string | null
    content: string | null
    contentType: string
    articleTopic: string | null
    category: string | null
    tags: string[]
    defaultKeyInsights: string[]
    defaultVideoScript: string | null
    defaultEmailTemplate: string | null
    defaultSocialContent: JsonValue | null
    position: number
    imageUrl: string | null
    sourceUrl: string | null
    metadata: JsonValue | null
    status: $Enums.ArticleStatus
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    createdByAdminId: string | null
    lastEditedByAdminId: string | null
    _count: ArticleCountAggregateOutputType | null
    _avg: ArticleAvgAggregateOutputType | null
    _sum: ArticleSumAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    content?: boolean
    contentType?: boolean
    articleTopic?: boolean
    category?: boolean
    tags?: boolean
    defaultKeyInsights?: boolean
    defaultVideoScript?: boolean
    defaultEmailTemplate?: boolean
    defaultSocialContent?: boolean
    position?: boolean
    imageUrl?: boolean
    sourceUrl?: boolean
    metadata?: boolean
    status?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByAdminId?: boolean
    lastEditedByAdminId?: boolean
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
    personalizations?: boolean | Article$personalizationsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    content?: boolean
    contentType?: boolean
    articleTopic?: boolean
    category?: boolean
    tags?: boolean
    defaultKeyInsights?: boolean
    defaultVideoScript?: boolean
    defaultEmailTemplate?: boolean
    defaultSocialContent?: boolean
    position?: boolean
    imageUrl?: boolean
    sourceUrl?: boolean
    metadata?: boolean
    status?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByAdminId?: boolean
    lastEditedByAdminId?: boolean
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    content?: boolean
    contentType?: boolean
    articleTopic?: boolean
    category?: boolean
    tags?: boolean
    defaultKeyInsights?: boolean
    defaultVideoScript?: boolean
    defaultEmailTemplate?: boolean
    defaultSocialContent?: boolean
    position?: boolean
    imageUrl?: boolean
    sourceUrl?: boolean
    metadata?: boolean
    status?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByAdminId?: boolean
    lastEditedByAdminId?: boolean
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    summary?: boolean
    content?: boolean
    contentType?: boolean
    articleTopic?: boolean
    category?: boolean
    tags?: boolean
    defaultKeyInsights?: boolean
    defaultVideoScript?: boolean
    defaultEmailTemplate?: boolean
    defaultSocialContent?: boolean
    position?: boolean
    imageUrl?: boolean
    sourceUrl?: boolean
    metadata?: boolean
    status?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdByAdminId?: boolean
    lastEditedByAdminId?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "summary" | "content" | "contentType" | "articleTopic" | "category" | "tags" | "defaultKeyInsights" | "defaultVideoScript" | "defaultEmailTemplate" | "defaultSocialContent" | "position" | "imageUrl" | "sourceUrl" | "metadata" | "status" | "publishedAt" | "createdAt" | "updatedAt" | "createdByAdminId" | "lastEditedByAdminId", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
    personalizations?: boolean | Article$personalizationsArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
  }
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | Article$createdByArgs<ExtArgs>
    lastEditedBy?: boolean | Article$lastEditedByArgs<ExtArgs>
  }

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs> | null
      lastEditedBy: Prisma.$UserPayload<ExtArgs> | null
      /**
       * User personalizations of this article
       */
      personalizations: Prisma.$PersonalizedOutputPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the article
       */
      id: string
      /**
       * Article title
       */
      title: string
      /**
       * Article summary
       */
      summary: string | null
      /**
       * Main article body content
       */
      content: string | null
      /**
       * Type of content (article, ad, etc.)
       */
      contentType: string
      /**
       * Topic category
       */
      articleTopic: string | null
      /**
       * Article category
       */
      category: string | null
      /**
       * Article tags
       */
      tags: string[]
      /**
       * Default key insights
       */
      defaultKeyInsights: string[]
      /**
       * Default video script
       */
      defaultVideoScript: string | null
      /**
       * Default email template
       */
      defaultEmailTemplate: string | null
      /**
       * Default social media content
       */
      defaultSocialContent: Prisma.JsonValue | null
      /**
       * Display position
       */
      position: number
      /**
       * Article image URL
       */
      imageUrl: string | null
      /**
       * Source URL for reference
       */
      sourceUrl: string | null
      /**
       * Additional metadata
       */
      metadata: Prisma.JsonValue | null
      /**
       * Article status
       */
      status: $Enums.ArticleStatus
      /**
       * When article was published
       */
      publishedAt: Date | null
      /**
       * When article was created
       */
      createdAt: Date
      /**
       * When article was last updated
       */
      updatedAt: Date
      /**
       * Admin who created the article
       */
      createdByAdminId: string | null
      /**
       * Admin who last edited the article
       */
      lastEditedByAdminId: string | null
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends Article$createdByArgs<ExtArgs> = {}>(args?: Subset<T, Article$createdByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lastEditedBy<T extends Article$lastEditedByArgs<ExtArgs> = {}>(args?: Subset<T, Article$lastEditedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    personalizations<T extends Article$personalizationsArgs<ExtArgs> = {}>(args?: Subset<T, Article$personalizationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly summary: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly contentType: FieldRef<"Article", 'String'>
    readonly articleTopic: FieldRef<"Article", 'String'>
    readonly category: FieldRef<"Article", 'String'>
    readonly tags: FieldRef<"Article", 'String[]'>
    readonly defaultKeyInsights: FieldRef<"Article", 'String[]'>
    readonly defaultVideoScript: FieldRef<"Article", 'String'>
    readonly defaultEmailTemplate: FieldRef<"Article", 'String'>
    readonly defaultSocialContent: FieldRef<"Article", 'Json'>
    readonly position: FieldRef<"Article", 'Int'>
    readonly imageUrl: FieldRef<"Article", 'String'>
    readonly sourceUrl: FieldRef<"Article", 'String'>
    readonly metadata: FieldRef<"Article", 'Json'>
    readonly status: FieldRef<"Article", 'ArticleStatus'>
    readonly publishedAt: FieldRef<"Article", 'DateTime'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
    readonly createdByAdminId: FieldRef<"Article", 'String'>
    readonly lastEditedByAdminId: FieldRef<"Article", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article.createdBy
   */
  export type Article$createdByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Article.lastEditedBy
   */
  export type Article$lastEditedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Article.personalizations
   */
  export type Article$personalizationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    where?: PersonalizedOutputWhereInput
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    cursor?: PersonalizedOutputWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersonalizedOutputScalarFieldEnum | PersonalizedOutputScalarFieldEnum[]
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model PersonalizedOutput
   */

  export type AggregatePersonalizedOutput = {
    _count: PersonalizedOutputCountAggregateOutputType | null
    _avg: PersonalizedOutputAvgAggregateOutputType | null
    _sum: PersonalizedOutputSumAggregateOutputType | null
    _min: PersonalizedOutputMinAggregateOutputType | null
    _max: PersonalizedOutputMaxAggregateOutputType | null
  }

  export type PersonalizedOutputAvgAggregateOutputType = {
    tokensUsed: number | null
    generationCount: number | null
  }

  export type PersonalizedOutputSumAggregateOutputType = {
    tokensUsed: number | null
    generationCount: number | null
  }

  export type PersonalizedOutputMinAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    personalizedVideoScript: string | null
    personalizedEmailTemplate: string | null
    tokensUsed: number | null
    generationCount: number | null
    lastGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type PersonalizedOutputMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    personalizedVideoScript: string | null
    personalizedEmailTemplate: string | null
    tokensUsed: number | null
    generationCount: number | null
    lastGeneratedAt: Date | null
    createdAt: Date | null
  }

  export type PersonalizedOutputCountAggregateOutputType = {
    id: number
    userId: number
    articleId: number
    personalizedKeyInsights: number
    personalizedVideoScript: number
    personalizedEmailTemplate: number
    personalizedSocialContent: number
    truetoneSettings: number
    tokensUsed: number
    generationCount: number
    lastGeneratedAt: number
    createdAt: number
    _all: number
  }


  export type PersonalizedOutputAvgAggregateInputType = {
    tokensUsed?: true
    generationCount?: true
  }

  export type PersonalizedOutputSumAggregateInputType = {
    tokensUsed?: true
    generationCount?: true
  }

  export type PersonalizedOutputMinAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    personalizedVideoScript?: true
    personalizedEmailTemplate?: true
    tokensUsed?: true
    generationCount?: true
    lastGeneratedAt?: true
    createdAt?: true
  }

  export type PersonalizedOutputMaxAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    personalizedVideoScript?: true
    personalizedEmailTemplate?: true
    tokensUsed?: true
    generationCount?: true
    lastGeneratedAt?: true
    createdAt?: true
  }

  export type PersonalizedOutputCountAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    personalizedKeyInsights?: true
    personalizedVideoScript?: true
    personalizedEmailTemplate?: true
    personalizedSocialContent?: true
    truetoneSettings?: true
    tokensUsed?: true
    generationCount?: true
    lastGeneratedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PersonalizedOutputAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PersonalizedOutput to aggregate.
     */
    where?: PersonalizedOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalizedOutputs to fetch.
     */
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonalizedOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalizedOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalizedOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PersonalizedOutputs
    **/
    _count?: true | PersonalizedOutputCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersonalizedOutputAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersonalizedOutputSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonalizedOutputMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonalizedOutputMaxAggregateInputType
  }

  export type GetPersonalizedOutputAggregateType<T extends PersonalizedOutputAggregateArgs> = {
        [P in keyof T & keyof AggregatePersonalizedOutput]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersonalizedOutput[P]>
      : GetScalarType<T[P], AggregatePersonalizedOutput[P]>
  }




  export type PersonalizedOutputGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalizedOutputWhereInput
    orderBy?: PersonalizedOutputOrderByWithAggregationInput | PersonalizedOutputOrderByWithAggregationInput[]
    by: PersonalizedOutputScalarFieldEnum[] | PersonalizedOutputScalarFieldEnum
    having?: PersonalizedOutputScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonalizedOutputCountAggregateInputType | true
    _avg?: PersonalizedOutputAvgAggregateInputType
    _sum?: PersonalizedOutputSumAggregateInputType
    _min?: PersonalizedOutputMinAggregateInputType
    _max?: PersonalizedOutputMaxAggregateInputType
  }

  export type PersonalizedOutputGroupByOutputType = {
    id: string
    userId: string
    articleId: string
    personalizedKeyInsights: string[]
    personalizedVideoScript: string | null
    personalizedEmailTemplate: string | null
    personalizedSocialContent: JsonValue | null
    truetoneSettings: JsonValue | null
    tokensUsed: number | null
    generationCount: number
    lastGeneratedAt: Date
    createdAt: Date
    _count: PersonalizedOutputCountAggregateOutputType | null
    _avg: PersonalizedOutputAvgAggregateOutputType | null
    _sum: PersonalizedOutputSumAggregateOutputType | null
    _min: PersonalizedOutputMinAggregateOutputType | null
    _max: PersonalizedOutputMaxAggregateOutputType | null
  }

  type GetPersonalizedOutputGroupByPayload<T extends PersonalizedOutputGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonalizedOutputGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonalizedOutputGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonalizedOutputGroupByOutputType[P]>
            : GetScalarType<T[P], PersonalizedOutputGroupByOutputType[P]>
        }
      >
    >


  export type PersonalizedOutputSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    personalizedKeyInsights?: boolean
    personalizedVideoScript?: boolean
    personalizedEmailTemplate?: boolean
    personalizedSocialContent?: boolean
    truetoneSettings?: boolean
    tokensUsed?: boolean
    generationCount?: boolean
    lastGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalizedOutput"]>

  export type PersonalizedOutputSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    personalizedKeyInsights?: boolean
    personalizedVideoScript?: boolean
    personalizedEmailTemplate?: boolean
    personalizedSocialContent?: boolean
    truetoneSettings?: boolean
    tokensUsed?: boolean
    generationCount?: boolean
    lastGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalizedOutput"]>

  export type PersonalizedOutputSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    personalizedKeyInsights?: boolean
    personalizedVideoScript?: boolean
    personalizedEmailTemplate?: boolean
    personalizedSocialContent?: boolean
    truetoneSettings?: boolean
    tokensUsed?: boolean
    generationCount?: boolean
    lastGeneratedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personalizedOutput"]>

  export type PersonalizedOutputSelectScalar = {
    id?: boolean
    userId?: boolean
    articleId?: boolean
    personalizedKeyInsights?: boolean
    personalizedVideoScript?: boolean
    personalizedEmailTemplate?: boolean
    personalizedSocialContent?: boolean
    truetoneSettings?: boolean
    tokensUsed?: boolean
    generationCount?: boolean
    lastGeneratedAt?: boolean
    createdAt?: boolean
  }

  export type PersonalizedOutputOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "articleId" | "personalizedKeyInsights" | "personalizedVideoScript" | "personalizedEmailTemplate" | "personalizedSocialContent" | "truetoneSettings" | "tokensUsed" | "generationCount" | "lastGeneratedAt" | "createdAt", ExtArgs["result"]["personalizedOutput"]>
  export type PersonalizedOutputInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type PersonalizedOutputIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type PersonalizedOutputIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $PersonalizedOutputPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PersonalizedOutput"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the personalization
       */
      id: string
      /**
       * User who owns this personalization
       */
      userId: string
      /**
       * Article being personalized
       */
      articleId: string
      /**
       * Personalized key insights
       */
      personalizedKeyInsights: string[]
      /**
       * Personalized video script
       */
      personalizedVideoScript: string | null
      /**
       * Personalized email template
       */
      personalizedEmailTemplate: string | null
      /**
       * Personalized social media content
       */
      personalizedSocialContent: Prisma.JsonValue | null
      /**
       * TrueTone settings used for generation
       */
      truetoneSettings: Prisma.JsonValue | null
      /**
       * AI tokens consumed for generation
       */
      tokensUsed: number | null
      /**
       * Number of times regenerated
       */
      generationCount: number
      /**
       * Last generation timestamp
       */
      lastGeneratedAt: Date
      /**
       * First creation timestamp
       */
      createdAt: Date
    }, ExtArgs["result"]["personalizedOutput"]>
    composites: {}
  }

  type PersonalizedOutputGetPayload<S extends boolean | null | undefined | PersonalizedOutputDefaultArgs> = $Result.GetResult<Prisma.$PersonalizedOutputPayload, S>

  type PersonalizedOutputCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PersonalizedOutputFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PersonalizedOutputCountAggregateInputType | true
    }

  export interface PersonalizedOutputDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PersonalizedOutput'], meta: { name: 'PersonalizedOutput' } }
    /**
     * Find zero or one PersonalizedOutput that matches the filter.
     * @param {PersonalizedOutputFindUniqueArgs} args - Arguments to find a PersonalizedOutput
     * @example
     * // Get one PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonalizedOutputFindUniqueArgs>(args: SelectSubset<T, PersonalizedOutputFindUniqueArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PersonalizedOutput that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PersonalizedOutputFindUniqueOrThrowArgs} args - Arguments to find a PersonalizedOutput
     * @example
     * // Get one PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonalizedOutputFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonalizedOutputFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PersonalizedOutput that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputFindFirstArgs} args - Arguments to find a PersonalizedOutput
     * @example
     * // Get one PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonalizedOutputFindFirstArgs>(args?: SelectSubset<T, PersonalizedOutputFindFirstArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PersonalizedOutput that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputFindFirstOrThrowArgs} args - Arguments to find a PersonalizedOutput
     * @example
     * // Get one PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonalizedOutputFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonalizedOutputFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PersonalizedOutputs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PersonalizedOutputs
     * const personalizedOutputs = await prisma.personalizedOutput.findMany()
     * 
     * // Get first 10 PersonalizedOutputs
     * const personalizedOutputs = await prisma.personalizedOutput.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const personalizedOutputWithIdOnly = await prisma.personalizedOutput.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PersonalizedOutputFindManyArgs>(args?: SelectSubset<T, PersonalizedOutputFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PersonalizedOutput.
     * @param {PersonalizedOutputCreateArgs} args - Arguments to create a PersonalizedOutput.
     * @example
     * // Create one PersonalizedOutput
     * const PersonalizedOutput = await prisma.personalizedOutput.create({
     *   data: {
     *     // ... data to create a PersonalizedOutput
     *   }
     * })
     * 
     */
    create<T extends PersonalizedOutputCreateArgs>(args: SelectSubset<T, PersonalizedOutputCreateArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PersonalizedOutputs.
     * @param {PersonalizedOutputCreateManyArgs} args - Arguments to create many PersonalizedOutputs.
     * @example
     * // Create many PersonalizedOutputs
     * const personalizedOutput = await prisma.personalizedOutput.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonalizedOutputCreateManyArgs>(args?: SelectSubset<T, PersonalizedOutputCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PersonalizedOutputs and returns the data saved in the database.
     * @param {PersonalizedOutputCreateManyAndReturnArgs} args - Arguments to create many PersonalizedOutputs.
     * @example
     * // Create many PersonalizedOutputs
     * const personalizedOutput = await prisma.personalizedOutput.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PersonalizedOutputs and only return the `id`
     * const personalizedOutputWithIdOnly = await prisma.personalizedOutput.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonalizedOutputCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonalizedOutputCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PersonalizedOutput.
     * @param {PersonalizedOutputDeleteArgs} args - Arguments to delete one PersonalizedOutput.
     * @example
     * // Delete one PersonalizedOutput
     * const PersonalizedOutput = await prisma.personalizedOutput.delete({
     *   where: {
     *     // ... filter to delete one PersonalizedOutput
     *   }
     * })
     * 
     */
    delete<T extends PersonalizedOutputDeleteArgs>(args: SelectSubset<T, PersonalizedOutputDeleteArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PersonalizedOutput.
     * @param {PersonalizedOutputUpdateArgs} args - Arguments to update one PersonalizedOutput.
     * @example
     * // Update one PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonalizedOutputUpdateArgs>(args: SelectSubset<T, PersonalizedOutputUpdateArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PersonalizedOutputs.
     * @param {PersonalizedOutputDeleteManyArgs} args - Arguments to filter PersonalizedOutputs to delete.
     * @example
     * // Delete a few PersonalizedOutputs
     * const { count } = await prisma.personalizedOutput.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonalizedOutputDeleteManyArgs>(args?: SelectSubset<T, PersonalizedOutputDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PersonalizedOutputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PersonalizedOutputs
     * const personalizedOutput = await prisma.personalizedOutput.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonalizedOutputUpdateManyArgs>(args: SelectSubset<T, PersonalizedOutputUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PersonalizedOutputs and returns the data updated in the database.
     * @param {PersonalizedOutputUpdateManyAndReturnArgs} args - Arguments to update many PersonalizedOutputs.
     * @example
     * // Update many PersonalizedOutputs
     * const personalizedOutput = await prisma.personalizedOutput.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PersonalizedOutputs and only return the `id`
     * const personalizedOutputWithIdOnly = await prisma.personalizedOutput.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PersonalizedOutputUpdateManyAndReturnArgs>(args: SelectSubset<T, PersonalizedOutputUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PersonalizedOutput.
     * @param {PersonalizedOutputUpsertArgs} args - Arguments to update or create a PersonalizedOutput.
     * @example
     * // Update or create a PersonalizedOutput
     * const personalizedOutput = await prisma.personalizedOutput.upsert({
     *   create: {
     *     // ... data to create a PersonalizedOutput
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PersonalizedOutput we want to update
     *   }
     * })
     */
    upsert<T extends PersonalizedOutputUpsertArgs>(args: SelectSubset<T, PersonalizedOutputUpsertArgs<ExtArgs>>): Prisma__PersonalizedOutputClient<$Result.GetResult<Prisma.$PersonalizedOutputPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PersonalizedOutputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputCountArgs} args - Arguments to filter PersonalizedOutputs to count.
     * @example
     * // Count the number of PersonalizedOutputs
     * const count = await prisma.personalizedOutput.count({
     *   where: {
     *     // ... the filter for the PersonalizedOutputs we want to count
     *   }
     * })
    **/
    count<T extends PersonalizedOutputCountArgs>(
      args?: Subset<T, PersonalizedOutputCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonalizedOutputCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PersonalizedOutput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonalizedOutputAggregateArgs>(args: Subset<T, PersonalizedOutputAggregateArgs>): Prisma.PrismaPromise<GetPersonalizedOutputAggregateType<T>>

    /**
     * Group by PersonalizedOutput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalizedOutputGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonalizedOutputGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonalizedOutputGroupByArgs['orderBy'] }
        : { orderBy?: PersonalizedOutputGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonalizedOutputGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonalizedOutputGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PersonalizedOutput model
   */
  readonly fields: PersonalizedOutputFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PersonalizedOutput.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonalizedOutputClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PersonalizedOutput model
   */
  interface PersonalizedOutputFieldRefs {
    readonly id: FieldRef<"PersonalizedOutput", 'String'>
    readonly userId: FieldRef<"PersonalizedOutput", 'String'>
    readonly articleId: FieldRef<"PersonalizedOutput", 'String'>
    readonly personalizedKeyInsights: FieldRef<"PersonalizedOutput", 'String[]'>
    readonly personalizedVideoScript: FieldRef<"PersonalizedOutput", 'String'>
    readonly personalizedEmailTemplate: FieldRef<"PersonalizedOutput", 'String'>
    readonly personalizedSocialContent: FieldRef<"PersonalizedOutput", 'Json'>
    readonly truetoneSettings: FieldRef<"PersonalizedOutput", 'Json'>
    readonly tokensUsed: FieldRef<"PersonalizedOutput", 'Int'>
    readonly generationCount: FieldRef<"PersonalizedOutput", 'Int'>
    readonly lastGeneratedAt: FieldRef<"PersonalizedOutput", 'DateTime'>
    readonly createdAt: FieldRef<"PersonalizedOutput", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PersonalizedOutput findUnique
   */
  export type PersonalizedOutputFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter, which PersonalizedOutput to fetch.
     */
    where: PersonalizedOutputWhereUniqueInput
  }

  /**
   * PersonalizedOutput findUniqueOrThrow
   */
  export type PersonalizedOutputFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter, which PersonalizedOutput to fetch.
     */
    where: PersonalizedOutputWhereUniqueInput
  }

  /**
   * PersonalizedOutput findFirst
   */
  export type PersonalizedOutputFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter, which PersonalizedOutput to fetch.
     */
    where?: PersonalizedOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalizedOutputs to fetch.
     */
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PersonalizedOutputs.
     */
    cursor?: PersonalizedOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalizedOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalizedOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PersonalizedOutputs.
     */
    distinct?: PersonalizedOutputScalarFieldEnum | PersonalizedOutputScalarFieldEnum[]
  }

  /**
   * PersonalizedOutput findFirstOrThrow
   */
  export type PersonalizedOutputFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter, which PersonalizedOutput to fetch.
     */
    where?: PersonalizedOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalizedOutputs to fetch.
     */
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PersonalizedOutputs.
     */
    cursor?: PersonalizedOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalizedOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalizedOutputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PersonalizedOutputs.
     */
    distinct?: PersonalizedOutputScalarFieldEnum | PersonalizedOutputScalarFieldEnum[]
  }

  /**
   * PersonalizedOutput findMany
   */
  export type PersonalizedOutputFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter, which PersonalizedOutputs to fetch.
     */
    where?: PersonalizedOutputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PersonalizedOutputs to fetch.
     */
    orderBy?: PersonalizedOutputOrderByWithRelationInput | PersonalizedOutputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PersonalizedOutputs.
     */
    cursor?: PersonalizedOutputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PersonalizedOutputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PersonalizedOutputs.
     */
    skip?: number
    distinct?: PersonalizedOutputScalarFieldEnum | PersonalizedOutputScalarFieldEnum[]
  }

  /**
   * PersonalizedOutput create
   */
  export type PersonalizedOutputCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * The data needed to create a PersonalizedOutput.
     */
    data: XOR<PersonalizedOutputCreateInput, PersonalizedOutputUncheckedCreateInput>
  }

  /**
   * PersonalizedOutput createMany
   */
  export type PersonalizedOutputCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PersonalizedOutputs.
     */
    data: PersonalizedOutputCreateManyInput | PersonalizedOutputCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PersonalizedOutput createManyAndReturn
   */
  export type PersonalizedOutputCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * The data used to create many PersonalizedOutputs.
     */
    data: PersonalizedOutputCreateManyInput | PersonalizedOutputCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PersonalizedOutput update
   */
  export type PersonalizedOutputUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * The data needed to update a PersonalizedOutput.
     */
    data: XOR<PersonalizedOutputUpdateInput, PersonalizedOutputUncheckedUpdateInput>
    /**
     * Choose, which PersonalizedOutput to update.
     */
    where: PersonalizedOutputWhereUniqueInput
  }

  /**
   * PersonalizedOutput updateMany
   */
  export type PersonalizedOutputUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PersonalizedOutputs.
     */
    data: XOR<PersonalizedOutputUpdateManyMutationInput, PersonalizedOutputUncheckedUpdateManyInput>
    /**
     * Filter which PersonalizedOutputs to update
     */
    where?: PersonalizedOutputWhereInput
    /**
     * Limit how many PersonalizedOutputs to update.
     */
    limit?: number
  }

  /**
   * PersonalizedOutput updateManyAndReturn
   */
  export type PersonalizedOutputUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * The data used to update PersonalizedOutputs.
     */
    data: XOR<PersonalizedOutputUpdateManyMutationInput, PersonalizedOutputUncheckedUpdateManyInput>
    /**
     * Filter which PersonalizedOutputs to update
     */
    where?: PersonalizedOutputWhereInput
    /**
     * Limit how many PersonalizedOutputs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PersonalizedOutput upsert
   */
  export type PersonalizedOutputUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * The filter to search for the PersonalizedOutput to update in case it exists.
     */
    where: PersonalizedOutputWhereUniqueInput
    /**
     * In case the PersonalizedOutput found by the `where` argument doesn't exist, create a new PersonalizedOutput with this data.
     */
    create: XOR<PersonalizedOutputCreateInput, PersonalizedOutputUncheckedCreateInput>
    /**
     * In case the PersonalizedOutput was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonalizedOutputUpdateInput, PersonalizedOutputUncheckedUpdateInput>
  }

  /**
   * PersonalizedOutput delete
   */
  export type PersonalizedOutputDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
    /**
     * Filter which PersonalizedOutput to delete.
     */
    where: PersonalizedOutputWhereUniqueInput
  }

  /**
   * PersonalizedOutput deleteMany
   */
  export type PersonalizedOutputDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PersonalizedOutputs to delete
     */
    where?: PersonalizedOutputWhereInput
    /**
     * Limit how many PersonalizedOutputs to delete.
     */
    limit?: number
  }

  /**
   * PersonalizedOutput without action
   */
  export type PersonalizedOutputDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalizedOutput
     */
    select?: PersonalizedOutputSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PersonalizedOutput
     */
    omit?: PersonalizedOutputOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalizedOutputInclude<ExtArgs> | null
  }


  /**
   * Model AnonymousAiUsage
   */

  export type AggregateAnonymousAiUsage = {
    _count: AnonymousAiUsageCountAggregateOutputType | null
    _avg: AnonymousAiUsageAvgAggregateOutputType | null
    _sum: AnonymousAiUsageSumAggregateOutputType | null
    _min: AnonymousAiUsageMinAggregateOutputType | null
    _max: AnonymousAiUsageMaxAggregateOutputType | null
  }

  export type AnonymousAiUsageAvgAggregateOutputType = {
    generationsUsed: number | null
  }

  export type AnonymousAiUsageSumAggregateOutputType = {
    generationsUsed: number | null
  }

  export type AnonymousAiUsageMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    ipAddress: string | null
    generationsUsed: number | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type AnonymousAiUsageMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    ipAddress: string | null
    generationsUsed: number | null
    createdAt: Date | null
    lastUsedAt: Date | null
  }

  export type AnonymousAiUsageCountAggregateOutputType = {
    id: number
    sessionId: number
    ipAddress: number
    generationsUsed: number
    createdAt: number
    lastUsedAt: number
    _all: number
  }


  export type AnonymousAiUsageAvgAggregateInputType = {
    generationsUsed?: true
  }

  export type AnonymousAiUsageSumAggregateInputType = {
    generationsUsed?: true
  }

  export type AnonymousAiUsageMinAggregateInputType = {
    id?: true
    sessionId?: true
    ipAddress?: true
    generationsUsed?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type AnonymousAiUsageMaxAggregateInputType = {
    id?: true
    sessionId?: true
    ipAddress?: true
    generationsUsed?: true
    createdAt?: true
    lastUsedAt?: true
  }

  export type AnonymousAiUsageCountAggregateInputType = {
    id?: true
    sessionId?: true
    ipAddress?: true
    generationsUsed?: true
    createdAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type AnonymousAiUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousAiUsage to aggregate.
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAiUsages to fetch.
     */
    orderBy?: AnonymousAiUsageOrderByWithRelationInput | AnonymousAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnonymousAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnonymousAiUsages
    **/
    _count?: true | AnonymousAiUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnonymousAiUsageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnonymousAiUsageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnonymousAiUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnonymousAiUsageMaxAggregateInputType
  }

  export type GetAnonymousAiUsageAggregateType<T extends AnonymousAiUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateAnonymousAiUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnonymousAiUsage[P]>
      : GetScalarType<T[P], AggregateAnonymousAiUsage[P]>
  }




  export type AnonymousAiUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnonymousAiUsageWhereInput
    orderBy?: AnonymousAiUsageOrderByWithAggregationInput | AnonymousAiUsageOrderByWithAggregationInput[]
    by: AnonymousAiUsageScalarFieldEnum[] | AnonymousAiUsageScalarFieldEnum
    having?: AnonymousAiUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnonymousAiUsageCountAggregateInputType | true
    _avg?: AnonymousAiUsageAvgAggregateInputType
    _sum?: AnonymousAiUsageSumAggregateInputType
    _min?: AnonymousAiUsageMinAggregateInputType
    _max?: AnonymousAiUsageMaxAggregateInputType
  }

  export type AnonymousAiUsageGroupByOutputType = {
    id: string
    sessionId: string
    ipAddress: string | null
    generationsUsed: number
    createdAt: Date
    lastUsedAt: Date
    _count: AnonymousAiUsageCountAggregateOutputType | null
    _avg: AnonymousAiUsageAvgAggregateOutputType | null
    _sum: AnonymousAiUsageSumAggregateOutputType | null
    _min: AnonymousAiUsageMinAggregateOutputType | null
    _max: AnonymousAiUsageMaxAggregateOutputType | null
  }

  type GetAnonymousAiUsageGroupByPayload<T extends AnonymousAiUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnonymousAiUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnonymousAiUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnonymousAiUsageGroupByOutputType[P]>
            : GetScalarType<T[P], AnonymousAiUsageGroupByOutputType[P]>
        }
      >
    >


  export type AnonymousAiUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    generationsUsed?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }, ExtArgs["result"]["anonymousAiUsage"]>

  export type AnonymousAiUsageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    generationsUsed?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }, ExtArgs["result"]["anonymousAiUsage"]>

  export type AnonymousAiUsageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    generationsUsed?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }, ExtArgs["result"]["anonymousAiUsage"]>

  export type AnonymousAiUsageSelectScalar = {
    id?: boolean
    sessionId?: boolean
    ipAddress?: boolean
    generationsUsed?: boolean
    createdAt?: boolean
    lastUsedAt?: boolean
  }

  export type AnonymousAiUsageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "ipAddress" | "generationsUsed" | "createdAt" | "lastUsedAt", ExtArgs["result"]["anonymousAiUsage"]>

  export type $AnonymousAiUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnonymousAiUsage"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      /**
       * Unique identifier for the usage record
       */
      id: string
      /**
       * Client-generated session ID for tracking (unique for upserts)
       */
      sessionId: string
      /**
       * IP address for additional verification
       */
      ipAddress: string | null
      /**
       * Number of AI generations used by this session
       */
      generationsUsed: number
      /**
       * When the usage record was first created
       */
      createdAt: Date
      /**
       * When the last generation was performed
       */
      lastUsedAt: Date
    }, ExtArgs["result"]["anonymousAiUsage"]>
    composites: {}
  }

  type AnonymousAiUsageGetPayload<S extends boolean | null | undefined | AnonymousAiUsageDefaultArgs> = $Result.GetResult<Prisma.$AnonymousAiUsagePayload, S>

  type AnonymousAiUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnonymousAiUsageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnonymousAiUsageCountAggregateInputType | true
    }

  export interface AnonymousAiUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnonymousAiUsage'], meta: { name: 'AnonymousAiUsage' } }
    /**
     * Find zero or one AnonymousAiUsage that matches the filter.
     * @param {AnonymousAiUsageFindUniqueArgs} args - Arguments to find a AnonymousAiUsage
     * @example
     * // Get one AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnonymousAiUsageFindUniqueArgs>(args: SelectSubset<T, AnonymousAiUsageFindUniqueArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnonymousAiUsage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnonymousAiUsageFindUniqueOrThrowArgs} args - Arguments to find a AnonymousAiUsage
     * @example
     * // Get one AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnonymousAiUsageFindUniqueOrThrowArgs>(args: SelectSubset<T, AnonymousAiUsageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnonymousAiUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageFindFirstArgs} args - Arguments to find a AnonymousAiUsage
     * @example
     * // Get one AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnonymousAiUsageFindFirstArgs>(args?: SelectSubset<T, AnonymousAiUsageFindFirstArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnonymousAiUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageFindFirstOrThrowArgs} args - Arguments to find a AnonymousAiUsage
     * @example
     * // Get one AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnonymousAiUsageFindFirstOrThrowArgs>(args?: SelectSubset<T, AnonymousAiUsageFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnonymousAiUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnonymousAiUsages
     * const anonymousAiUsages = await prisma.anonymousAiUsage.findMany()
     * 
     * // Get first 10 AnonymousAiUsages
     * const anonymousAiUsages = await prisma.anonymousAiUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const anonymousAiUsageWithIdOnly = await prisma.anonymousAiUsage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnonymousAiUsageFindManyArgs>(args?: SelectSubset<T, AnonymousAiUsageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnonymousAiUsage.
     * @param {AnonymousAiUsageCreateArgs} args - Arguments to create a AnonymousAiUsage.
     * @example
     * // Create one AnonymousAiUsage
     * const AnonymousAiUsage = await prisma.anonymousAiUsage.create({
     *   data: {
     *     // ... data to create a AnonymousAiUsage
     *   }
     * })
     * 
     */
    create<T extends AnonymousAiUsageCreateArgs>(args: SelectSubset<T, AnonymousAiUsageCreateArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnonymousAiUsages.
     * @param {AnonymousAiUsageCreateManyArgs} args - Arguments to create many AnonymousAiUsages.
     * @example
     * // Create many AnonymousAiUsages
     * const anonymousAiUsage = await prisma.anonymousAiUsage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnonymousAiUsageCreateManyArgs>(args?: SelectSubset<T, AnonymousAiUsageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnonymousAiUsages and returns the data saved in the database.
     * @param {AnonymousAiUsageCreateManyAndReturnArgs} args - Arguments to create many AnonymousAiUsages.
     * @example
     * // Create many AnonymousAiUsages
     * const anonymousAiUsage = await prisma.anonymousAiUsage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnonymousAiUsages and only return the `id`
     * const anonymousAiUsageWithIdOnly = await prisma.anonymousAiUsage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnonymousAiUsageCreateManyAndReturnArgs>(args?: SelectSubset<T, AnonymousAiUsageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnonymousAiUsage.
     * @param {AnonymousAiUsageDeleteArgs} args - Arguments to delete one AnonymousAiUsage.
     * @example
     * // Delete one AnonymousAiUsage
     * const AnonymousAiUsage = await prisma.anonymousAiUsage.delete({
     *   where: {
     *     // ... filter to delete one AnonymousAiUsage
     *   }
     * })
     * 
     */
    delete<T extends AnonymousAiUsageDeleteArgs>(args: SelectSubset<T, AnonymousAiUsageDeleteArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnonymousAiUsage.
     * @param {AnonymousAiUsageUpdateArgs} args - Arguments to update one AnonymousAiUsage.
     * @example
     * // Update one AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnonymousAiUsageUpdateArgs>(args: SelectSubset<T, AnonymousAiUsageUpdateArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnonymousAiUsages.
     * @param {AnonymousAiUsageDeleteManyArgs} args - Arguments to filter AnonymousAiUsages to delete.
     * @example
     * // Delete a few AnonymousAiUsages
     * const { count } = await prisma.anonymousAiUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnonymousAiUsageDeleteManyArgs>(args?: SelectSubset<T, AnonymousAiUsageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousAiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnonymousAiUsages
     * const anonymousAiUsage = await prisma.anonymousAiUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnonymousAiUsageUpdateManyArgs>(args: SelectSubset<T, AnonymousAiUsageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnonymousAiUsages and returns the data updated in the database.
     * @param {AnonymousAiUsageUpdateManyAndReturnArgs} args - Arguments to update many AnonymousAiUsages.
     * @example
     * // Update many AnonymousAiUsages
     * const anonymousAiUsage = await prisma.anonymousAiUsage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnonymousAiUsages and only return the `id`
     * const anonymousAiUsageWithIdOnly = await prisma.anonymousAiUsage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnonymousAiUsageUpdateManyAndReturnArgs>(args: SelectSubset<T, AnonymousAiUsageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnonymousAiUsage.
     * @param {AnonymousAiUsageUpsertArgs} args - Arguments to update or create a AnonymousAiUsage.
     * @example
     * // Update or create a AnonymousAiUsage
     * const anonymousAiUsage = await prisma.anonymousAiUsage.upsert({
     *   create: {
     *     // ... data to create a AnonymousAiUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnonymousAiUsage we want to update
     *   }
     * })
     */
    upsert<T extends AnonymousAiUsageUpsertArgs>(args: SelectSubset<T, AnonymousAiUsageUpsertArgs<ExtArgs>>): Prisma__AnonymousAiUsageClient<$Result.GetResult<Prisma.$AnonymousAiUsagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnonymousAiUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageCountArgs} args - Arguments to filter AnonymousAiUsages to count.
     * @example
     * // Count the number of AnonymousAiUsages
     * const count = await prisma.anonymousAiUsage.count({
     *   where: {
     *     // ... the filter for the AnonymousAiUsages we want to count
     *   }
     * })
    **/
    count<T extends AnonymousAiUsageCountArgs>(
      args?: Subset<T, AnonymousAiUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnonymousAiUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnonymousAiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnonymousAiUsageAggregateArgs>(args: Subset<T, AnonymousAiUsageAggregateArgs>): Prisma.PrismaPromise<GetAnonymousAiUsageAggregateType<T>>

    /**
     * Group by AnonymousAiUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnonymousAiUsageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnonymousAiUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnonymousAiUsageGroupByArgs['orderBy'] }
        : { orderBy?: AnonymousAiUsageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnonymousAiUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnonymousAiUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnonymousAiUsage model
   */
  readonly fields: AnonymousAiUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnonymousAiUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnonymousAiUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnonymousAiUsage model
   */
  interface AnonymousAiUsageFieldRefs {
    readonly id: FieldRef<"AnonymousAiUsage", 'String'>
    readonly sessionId: FieldRef<"AnonymousAiUsage", 'String'>
    readonly ipAddress: FieldRef<"AnonymousAiUsage", 'String'>
    readonly generationsUsed: FieldRef<"AnonymousAiUsage", 'Int'>
    readonly createdAt: FieldRef<"AnonymousAiUsage", 'DateTime'>
    readonly lastUsedAt: FieldRef<"AnonymousAiUsage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AnonymousAiUsage findUnique
   */
  export type AnonymousAiUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AnonymousAiUsage to fetch.
     */
    where: AnonymousAiUsageWhereUniqueInput
  }

  /**
   * AnonymousAiUsage findUniqueOrThrow
   */
  export type AnonymousAiUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AnonymousAiUsage to fetch.
     */
    where: AnonymousAiUsageWhereUniqueInput
  }

  /**
   * AnonymousAiUsage findFirst
   */
  export type AnonymousAiUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AnonymousAiUsage to fetch.
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAiUsages to fetch.
     */
    orderBy?: AnonymousAiUsageOrderByWithRelationInput | AnonymousAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousAiUsages.
     */
    cursor?: AnonymousAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousAiUsages.
     */
    distinct?: AnonymousAiUsageScalarFieldEnum | AnonymousAiUsageScalarFieldEnum[]
  }

  /**
   * AnonymousAiUsage findFirstOrThrow
   */
  export type AnonymousAiUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AnonymousAiUsage to fetch.
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAiUsages to fetch.
     */
    orderBy?: AnonymousAiUsageOrderByWithRelationInput | AnonymousAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnonymousAiUsages.
     */
    cursor?: AnonymousAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAiUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnonymousAiUsages.
     */
    distinct?: AnonymousAiUsageScalarFieldEnum | AnonymousAiUsageScalarFieldEnum[]
  }

  /**
   * AnonymousAiUsage findMany
   */
  export type AnonymousAiUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter, which AnonymousAiUsages to fetch.
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnonymousAiUsages to fetch.
     */
    orderBy?: AnonymousAiUsageOrderByWithRelationInput | AnonymousAiUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnonymousAiUsages.
     */
    cursor?: AnonymousAiUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnonymousAiUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnonymousAiUsages.
     */
    skip?: number
    distinct?: AnonymousAiUsageScalarFieldEnum | AnonymousAiUsageScalarFieldEnum[]
  }

  /**
   * AnonymousAiUsage create
   */
  export type AnonymousAiUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * The data needed to create a AnonymousAiUsage.
     */
    data: XOR<AnonymousAiUsageCreateInput, AnonymousAiUsageUncheckedCreateInput>
  }

  /**
   * AnonymousAiUsage createMany
   */
  export type AnonymousAiUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnonymousAiUsages.
     */
    data: AnonymousAiUsageCreateManyInput | AnonymousAiUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnonymousAiUsage createManyAndReturn
   */
  export type AnonymousAiUsageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * The data used to create many AnonymousAiUsages.
     */
    data: AnonymousAiUsageCreateManyInput | AnonymousAiUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnonymousAiUsage update
   */
  export type AnonymousAiUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * The data needed to update a AnonymousAiUsage.
     */
    data: XOR<AnonymousAiUsageUpdateInput, AnonymousAiUsageUncheckedUpdateInput>
    /**
     * Choose, which AnonymousAiUsage to update.
     */
    where: AnonymousAiUsageWhereUniqueInput
  }

  /**
   * AnonymousAiUsage updateMany
   */
  export type AnonymousAiUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnonymousAiUsages.
     */
    data: XOR<AnonymousAiUsageUpdateManyMutationInput, AnonymousAiUsageUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousAiUsages to update
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * Limit how many AnonymousAiUsages to update.
     */
    limit?: number
  }

  /**
   * AnonymousAiUsage updateManyAndReturn
   */
  export type AnonymousAiUsageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * The data used to update AnonymousAiUsages.
     */
    data: XOR<AnonymousAiUsageUpdateManyMutationInput, AnonymousAiUsageUncheckedUpdateManyInput>
    /**
     * Filter which AnonymousAiUsages to update
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * Limit how many AnonymousAiUsages to update.
     */
    limit?: number
  }

  /**
   * AnonymousAiUsage upsert
   */
  export type AnonymousAiUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * The filter to search for the AnonymousAiUsage to update in case it exists.
     */
    where: AnonymousAiUsageWhereUniqueInput
    /**
     * In case the AnonymousAiUsage found by the `where` argument doesn't exist, create a new AnonymousAiUsage with this data.
     */
    create: XOR<AnonymousAiUsageCreateInput, AnonymousAiUsageUncheckedCreateInput>
    /**
     * In case the AnonymousAiUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnonymousAiUsageUpdateInput, AnonymousAiUsageUncheckedUpdateInput>
  }

  /**
   * AnonymousAiUsage delete
   */
  export type AnonymousAiUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
    /**
     * Filter which AnonymousAiUsage to delete.
     */
    where: AnonymousAiUsageWhereUniqueInput
  }

  /**
   * AnonymousAiUsage deleteMany
   */
  export type AnonymousAiUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnonymousAiUsages to delete
     */
    where?: AnonymousAiUsageWhereInput
    /**
     * Limit how many AnonymousAiUsages to delete.
     */
    limit?: number
  }

  /**
   * AnonymousAiUsage without action
   */
  export type AnonymousAiUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnonymousAiUsage
     */
    select?: AnonymousAiUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnonymousAiUsage
     */
    omit?: AnonymousAiUsageOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    company: 'company',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    kindeId: 'kindeId',
    categoryPreferences: 'categoryPreferences',
    savedArticleIds: 'savedArticleIds',
    subscriptionTier: 'subscriptionTier',
    subscriptionStatus: 'subscriptionStatus',
    subscriptionExpiresAt: 'subscriptionExpiresAt',
    subscriptionCreatedAt: 'subscriptionCreatedAt',
    monthlyGenerationLimit: 'monthlyGenerationLimit',
    monthlyGenerationsUsed: 'monthlyGenerationsUsed',
    generationResetDate: 'generationResetDate',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    stripePriceId: 'stripePriceId',
    hasCompletedOnboarding: 'hasCompletedOnboarding',
    onboardingStep: 'onboardingStep',
    onboardingCompletedAt: 'onboardingCompletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    publishedStatus: 'publishedStatus',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const LikeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    postId: 'postId',
    contentId: 'contentId',
    contentType: 'contentType',
    contentTitle: 'contentTitle',
    deviceType: 'deviceType',
    timestamp: 'timestamp'
  };

  export type LikeScalarFieldEnum = (typeof LikeScalarFieldEnum)[keyof typeof LikeScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    deviceType: 'deviceType',
    countryCode: 'countryCode',
    region: 'region',
    city: 'city',
    startedAt: 'startedAt',
    lastActiveAt: 'lastActiveAt',
    endedAt: 'endedAt',
    pageViews: 'pageViews',
    eventsCount: 'eventsCount'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const AnalyticsEventScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    userId: 'userId',
    eventType: 'eventType',
    eventAction: 'eventAction',
    eventCategory: 'eventCategory',
    eventLabel: 'eventLabel',
    eventValue: 'eventValue',
    pagePath: 'pagePath',
    elementId: 'elementId',
    elementType: 'elementType',
    metadata: 'metadata',
    timestamp: 'timestamp'
  };

  export type AnalyticsEventScalarFieldEnum = (typeof AnalyticsEventScalarFieldEnum)[keyof typeof AnalyticsEventScalarFieldEnum]


  export const PageViewScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    userId: 'userId',
    pagePath: 'pagePath',
    pageTitle: 'pageTitle',
    referrer: 'referrer',
    timeOnPage: 'timeOnPage',
    scrollDepth: 'scrollDepth',
    exitPage: 'exitPage',
    bounce: 'bounce',
    timestamp: 'timestamp'
  };

  export type PageViewScalarFieldEnum = (typeof PageViewScalarFieldEnum)[keyof typeof PageViewScalarFieldEnum]


  export const ChatAnalyticsScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    userId: 'userId',
    conversationId: 'conversationId',
    messageCount: 'messageCount',
    sessionDuration: 'sessionDuration',
    selectedArticle: 'selectedArticle',
    selectedContentType: 'selectedContentType',
    tokensUsed: 'tokensUsed',
    errorCount: 'errorCount',
    startedAt: 'startedAt',
    endedAt: 'endedAt'
  };

  export type ChatAnalyticsScalarFieldEnum = (typeof ChatAnalyticsScalarFieldEnum)[keyof typeof ChatAnalyticsScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    summary: 'summary',
    content: 'content',
    contentType: 'contentType',
    articleTopic: 'articleTopic',
    category: 'category',
    tags: 'tags',
    defaultKeyInsights: 'defaultKeyInsights',
    defaultVideoScript: 'defaultVideoScript',
    defaultEmailTemplate: 'defaultEmailTemplate',
    defaultSocialContent: 'defaultSocialContent',
    position: 'position',
    imageUrl: 'imageUrl',
    sourceUrl: 'sourceUrl',
    metadata: 'metadata',
    status: 'status',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdByAdminId: 'createdByAdminId',
    lastEditedByAdminId: 'lastEditedByAdminId'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const PersonalizedOutputScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    articleId: 'articleId',
    personalizedKeyInsights: 'personalizedKeyInsights',
    personalizedVideoScript: 'personalizedVideoScript',
    personalizedEmailTemplate: 'personalizedEmailTemplate',
    personalizedSocialContent: 'personalizedSocialContent',
    truetoneSettings: 'truetoneSettings',
    tokensUsed: 'tokensUsed',
    generationCount: 'generationCount',
    lastGeneratedAt: 'lastGeneratedAt',
    createdAt: 'createdAt'
  };

  export type PersonalizedOutputScalarFieldEnum = (typeof PersonalizedOutputScalarFieldEnum)[keyof typeof PersonalizedOutputScalarFieldEnum]


  export const AnonymousAiUsageScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    ipAddress: 'ipAddress',
    generationsUsed: 'generationsUsed',
    createdAt: 'createdAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type AnonymousAiUsageScalarFieldEnum = (typeof AnonymousAiUsageScalarFieldEnum)[keyof typeof AnonymousAiUsageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SubscriptionTier'
   */
  export type EnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier'>
    


  /**
   * Reference to a field of type 'SubscriptionTier[]'
   */
  export type ListEnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'PublishedStatus'
   */
  export type EnumPublishedStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PublishedStatus'>
    


  /**
   * Reference to a field of type 'PublishedStatus[]'
   */
  export type ListEnumPublishedStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PublishedStatus[]'>
    


  /**
   * Reference to a field of type 'ContentType'
   */
  export type EnumContentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentType'>
    


  /**
   * Reference to a field of type 'ContentType[]'
   */
  export type ListEnumContentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContentType[]'>
    


  /**
   * Reference to a field of type 'Device'
   */
  export type EnumDeviceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Device'>
    


  /**
   * Reference to a field of type 'Device[]'
   */
  export type ListEnumDeviceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Device[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'ArticleStatus'
   */
  export type EnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus'>
    


  /**
   * Reference to a field of type 'ArticleStatus[]'
   */
  export type ListEnumArticleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ArticleStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    company?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    kindeId?: StringNullableFilter<"User"> | string | null
    categoryPreferences?: StringNullableListFilter<"User">
    savedArticleIds?: StringNullableListFilter<"User">
    subscriptionTier?: EnumSubscriptionTierFilter<"User"> | $Enums.SubscriptionTier
    subscriptionStatus?: StringNullableFilter<"User"> | string | null
    subscriptionExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    subscriptionCreatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    monthlyGenerationLimit?: IntFilter<"User"> | number
    monthlyGenerationsUsed?: IntFilter<"User"> | number
    generationResetDate?: DateTimeNullableFilter<"User"> | Date | string | null
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"User"> | string | null
    stripePriceId?: StringNullableFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolFilter<"User"> | boolean
    onboardingStep?: IntNullableFilter<"User"> | number | null
    onboardingCompletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    likes?: LikeListRelationFilter
    sessions?: UserSessionListRelationFilter
    events?: AnalyticsEventListRelationFilter
    pageViews?: PageViewListRelationFilter
    chatAnalytics?: ChatAnalyticsListRelationFilter
    createdArticles?: ArticleListRelationFilter
    editedArticles?: ArticleListRelationFilter
    personalizations?: PersonalizedOutputListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    company?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kindeId?: SortOrderInput | SortOrder
    categoryPreferences?: SortOrder
    savedArticleIds?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrderInput | SortOrder
    subscriptionExpiresAt?: SortOrderInput | SortOrder
    subscriptionCreatedAt?: SortOrderInput | SortOrder
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    generationResetDate?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    stripePriceId?: SortOrderInput | SortOrder
    hasCompletedOnboarding?: SortOrder
    onboardingStep?: SortOrderInput | SortOrder
    onboardingCompletedAt?: SortOrderInput | SortOrder
    likes?: LikeOrderByRelationAggregateInput
    sessions?: UserSessionOrderByRelationAggregateInput
    events?: AnalyticsEventOrderByRelationAggregateInput
    pageViews?: PageViewOrderByRelationAggregateInput
    chatAnalytics?: ChatAnalyticsOrderByRelationAggregateInput
    createdArticles?: ArticleOrderByRelationAggregateInput
    editedArticles?: ArticleOrderByRelationAggregateInput
    personalizations?: PersonalizedOutputOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    kindeId?: string
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    company?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    categoryPreferences?: StringNullableListFilter<"User">
    savedArticleIds?: StringNullableListFilter<"User">
    subscriptionTier?: EnumSubscriptionTierFilter<"User"> | $Enums.SubscriptionTier
    subscriptionStatus?: StringNullableFilter<"User"> | string | null
    subscriptionExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    subscriptionCreatedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    monthlyGenerationLimit?: IntFilter<"User"> | number
    monthlyGenerationsUsed?: IntFilter<"User"> | number
    generationResetDate?: DateTimeNullableFilter<"User"> | Date | string | null
    stripePriceId?: StringNullableFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolFilter<"User"> | boolean
    onboardingStep?: IntNullableFilter<"User"> | number | null
    onboardingCompletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    likes?: LikeListRelationFilter
    sessions?: UserSessionListRelationFilter
    events?: AnalyticsEventListRelationFilter
    pageViews?: PageViewListRelationFilter
    chatAnalytics?: ChatAnalyticsListRelationFilter
    createdArticles?: ArticleListRelationFilter
    editedArticles?: ArticleListRelationFilter
    personalizations?: PersonalizedOutputListRelationFilter
  }, "id" | "email" | "kindeId" | "stripeCustomerId" | "stripeSubscriptionId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    company?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kindeId?: SortOrderInput | SortOrder
    categoryPreferences?: SortOrder
    savedArticleIds?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrderInput | SortOrder
    subscriptionExpiresAt?: SortOrderInput | SortOrder
    subscriptionCreatedAt?: SortOrderInput | SortOrder
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    generationResetDate?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    stripePriceId?: SortOrderInput | SortOrder
    hasCompletedOnboarding?: SortOrder
    onboardingStep?: SortOrderInput | SortOrder
    onboardingCompletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    company?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    kindeId?: StringNullableWithAggregatesFilter<"User"> | string | null
    categoryPreferences?: StringNullableListFilter<"User">
    savedArticleIds?: StringNullableListFilter<"User">
    subscriptionTier?: EnumSubscriptionTierWithAggregatesFilter<"User"> | $Enums.SubscriptionTier
    subscriptionStatus?: StringNullableWithAggregatesFilter<"User"> | string | null
    subscriptionExpiresAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    subscriptionCreatedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    monthlyGenerationLimit?: IntWithAggregatesFilter<"User"> | number
    monthlyGenerationsUsed?: IntWithAggregatesFilter<"User"> | number
    generationResetDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    stripePriceId?: StringNullableWithAggregatesFilter<"User"> | string | null
    hasCompletedOnboarding?: BoolWithAggregatesFilter<"User"> | boolean
    onboardingStep?: IntNullableWithAggregatesFilter<"User"> | number | null
    onboardingCompletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: UuidFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    content?: JsonFilter<"Post">
    publishedStatus?: EnumPublishedStatusFilter<"Post"> | $Enums.PublishedStatus
    publishedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    likes?: LikeListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    publishedStatus?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    likes?: LikeOrderByRelationAggregateInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    title?: StringFilter<"Post"> | string
    content?: JsonFilter<"Post">
    publishedStatus?: EnumPublishedStatusFilter<"Post"> | $Enums.PublishedStatus
    publishedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    likes?: LikeListRelationFilter
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    publishedStatus?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Post"> | string
    title?: StringWithAggregatesFilter<"Post"> | string
    content?: JsonWithAggregatesFilter<"Post">
    publishedStatus?: EnumPublishedStatusWithAggregatesFilter<"Post"> | $Enums.PublishedStatus
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type LikeWhereInput = {
    AND?: LikeWhereInput | LikeWhereInput[]
    OR?: LikeWhereInput[]
    NOT?: LikeWhereInput | LikeWhereInput[]
    id?: UuidFilter<"Like"> | string
    userId?: UuidFilter<"Like"> | string
    postId?: UuidFilter<"Like"> | string
    contentId?: StringFilter<"Like"> | string
    contentType?: EnumContentTypeFilter<"Like"> | $Enums.ContentType
    contentTitle?: StringFilter<"Like"> | string
    deviceType?: EnumDeviceFilter<"Like"> | $Enums.Device
    timestamp?: DateTimeFilter<"Like"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }

  export type LikeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    contentId?: SortOrder
    contentType?: SortOrder
    contentTitle?: SortOrder
    deviceType?: SortOrder
    timestamp?: SortOrder
    user?: UserOrderByWithRelationInput
    post?: PostOrderByWithRelationInput
  }

  export type LikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_postId_contentId_contentType?: LikeUserIdPostIdContentIdContentTypeCompoundUniqueInput
    AND?: LikeWhereInput | LikeWhereInput[]
    OR?: LikeWhereInput[]
    NOT?: LikeWhereInput | LikeWhereInput[]
    userId?: UuidFilter<"Like"> | string
    postId?: UuidFilter<"Like"> | string
    contentId?: StringFilter<"Like"> | string
    contentType?: EnumContentTypeFilter<"Like"> | $Enums.ContentType
    contentTitle?: StringFilter<"Like"> | string
    deviceType?: EnumDeviceFilter<"Like"> | $Enums.Device
    timestamp?: DateTimeFilter<"Like"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }, "id" | "userId_postId_contentId_contentType">

  export type LikeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    contentId?: SortOrder
    contentType?: SortOrder
    contentTitle?: SortOrder
    deviceType?: SortOrder
    timestamp?: SortOrder
    _count?: LikeCountOrderByAggregateInput
    _max?: LikeMaxOrderByAggregateInput
    _min?: LikeMinOrderByAggregateInput
  }

  export type LikeScalarWhereWithAggregatesInput = {
    AND?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[]
    OR?: LikeScalarWhereWithAggregatesInput[]
    NOT?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Like"> | string
    userId?: UuidWithAggregatesFilter<"Like"> | string
    postId?: UuidWithAggregatesFilter<"Like"> | string
    contentId?: StringWithAggregatesFilter<"Like"> | string
    contentType?: EnumContentTypeWithAggregatesFilter<"Like"> | $Enums.ContentType
    contentTitle?: StringWithAggregatesFilter<"Like"> | string
    deviceType?: EnumDeviceWithAggregatesFilter<"Like"> | $Enums.Device
    timestamp?: DateTimeWithAggregatesFilter<"Like"> | Date | string
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: UuidFilter<"UserSession"> | string
    userId?: UuidNullableFilter<"UserSession"> | string | null
    sessionId?: UuidFilter<"UserSession"> | string
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    deviceType?: EnumDeviceFilter<"UserSession"> | $Enums.Device
    countryCode?: StringNullableFilter<"UserSession"> | string | null
    region?: StringNullableFilter<"UserSession"> | string | null
    city?: StringNullableFilter<"UserSession"> | string | null
    startedAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActiveAt?: DateTimeFilter<"UserSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    pageViews?: IntFilter<"UserSession"> | number
    eventsCount?: IntFilter<"UserSession"> | number
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    events?: AnalyticsEventListRelationFilter
    pageViewsRel?: PageViewListRelationFilter
    chatSessions?: ChatAnalyticsListRelationFilter
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    countryCode?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    lastActiveAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    pageViews?: SortOrder
    eventsCount?: SortOrder
    user?: UserOrderByWithRelationInput
    events?: AnalyticsEventOrderByRelationAggregateInput
    pageViewsRel?: PageViewOrderByRelationAggregateInput
    chatSessions?: ChatAnalyticsOrderByRelationAggregateInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: UuidNullableFilter<"UserSession"> | string | null
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    deviceType?: EnumDeviceFilter<"UserSession"> | $Enums.Device
    countryCode?: StringNullableFilter<"UserSession"> | string | null
    region?: StringNullableFilter<"UserSession"> | string | null
    city?: StringNullableFilter<"UserSession"> | string | null
    startedAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActiveAt?: DateTimeFilter<"UserSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    pageViews?: IntFilter<"UserSession"> | number
    eventsCount?: IntFilter<"UserSession"> | number
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    events?: AnalyticsEventListRelationFilter
    pageViewsRel?: PageViewListRelationFilter
    chatSessions?: ChatAnalyticsListRelationFilter
  }, "id" | "sessionId">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    deviceType?: SortOrder
    countryCode?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    lastActiveAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    pageViews?: SortOrder
    eventsCount?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _avg?: UserSessionAvgOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
    _sum?: UserSessionSumOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserSession"> | string
    userId?: UuidNullableWithAggregatesFilter<"UserSession"> | string | null
    sessionId?: UuidWithAggregatesFilter<"UserSession"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    deviceType?: EnumDeviceWithAggregatesFilter<"UserSession"> | $Enums.Device
    countryCode?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    region?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    city?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    lastActiveAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"UserSession"> | Date | string | null
    pageViews?: IntWithAggregatesFilter<"UserSession"> | number
    eventsCount?: IntWithAggregatesFilter<"UserSession"> | number
  }

  export type AnalyticsEventWhereInput = {
    AND?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    OR?: AnalyticsEventWhereInput[]
    NOT?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    id?: UuidFilter<"AnalyticsEvent"> | string
    sessionId?: UuidFilter<"AnalyticsEvent"> | string
    userId?: UuidNullableFilter<"AnalyticsEvent"> | string | null
    eventType?: StringFilter<"AnalyticsEvent"> | string
    eventAction?: StringFilter<"AnalyticsEvent"> | string
    eventCategory?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventLabel?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventValue?: DecimalNullableFilter<"AnalyticsEvent"> | Decimal | DecimalJsLike | number | string | null
    pagePath?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementType?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    timestamp?: DateTimeFilter<"AnalyticsEvent"> | Date | string
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AnalyticsEventOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    eventAction?: SortOrder
    eventCategory?: SortOrderInput | SortOrder
    eventLabel?: SortOrderInput | SortOrder
    eventValue?: SortOrderInput | SortOrder
    pagePath?: SortOrderInput | SortOrder
    elementId?: SortOrderInput | SortOrder
    elementType?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    session?: UserSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AnalyticsEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    OR?: AnalyticsEventWhereInput[]
    NOT?: AnalyticsEventWhereInput | AnalyticsEventWhereInput[]
    sessionId?: UuidFilter<"AnalyticsEvent"> | string
    userId?: UuidNullableFilter<"AnalyticsEvent"> | string | null
    eventType?: StringFilter<"AnalyticsEvent"> | string
    eventAction?: StringFilter<"AnalyticsEvent"> | string
    eventCategory?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventLabel?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventValue?: DecimalNullableFilter<"AnalyticsEvent"> | Decimal | DecimalJsLike | number | string | null
    pagePath?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementType?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    timestamp?: DateTimeFilter<"AnalyticsEvent"> | Date | string
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AnalyticsEventOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    eventAction?: SortOrder
    eventCategory?: SortOrderInput | SortOrder
    eventLabel?: SortOrderInput | SortOrder
    eventValue?: SortOrderInput | SortOrder
    pagePath?: SortOrderInput | SortOrder
    elementId?: SortOrderInput | SortOrder
    elementType?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: AnalyticsEventCountOrderByAggregateInput
    _avg?: AnalyticsEventAvgOrderByAggregateInput
    _max?: AnalyticsEventMaxOrderByAggregateInput
    _min?: AnalyticsEventMinOrderByAggregateInput
    _sum?: AnalyticsEventSumOrderByAggregateInput
  }

  export type AnalyticsEventScalarWhereWithAggregatesInput = {
    AND?: AnalyticsEventScalarWhereWithAggregatesInput | AnalyticsEventScalarWhereWithAggregatesInput[]
    OR?: AnalyticsEventScalarWhereWithAggregatesInput[]
    NOT?: AnalyticsEventScalarWhereWithAggregatesInput | AnalyticsEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AnalyticsEvent"> | string
    sessionId?: UuidWithAggregatesFilter<"AnalyticsEvent"> | string
    userId?: UuidNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    eventType?: StringWithAggregatesFilter<"AnalyticsEvent"> | string
    eventAction?: StringWithAggregatesFilter<"AnalyticsEvent"> | string
    eventCategory?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    eventLabel?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    eventValue?: DecimalNullableWithAggregatesFilter<"AnalyticsEvent"> | Decimal | DecimalJsLike | number | string | null
    pagePath?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    elementId?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    elementType?: StringNullableWithAggregatesFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AnalyticsEvent">
    timestamp?: DateTimeWithAggregatesFilter<"AnalyticsEvent"> | Date | string
  }

  export type PageViewWhereInput = {
    AND?: PageViewWhereInput | PageViewWhereInput[]
    OR?: PageViewWhereInput[]
    NOT?: PageViewWhereInput | PageViewWhereInput[]
    id?: UuidFilter<"PageView"> | string
    sessionId?: UuidFilter<"PageView"> | string
    userId?: UuidNullableFilter<"PageView"> | string | null
    pagePath?: StringFilter<"PageView"> | string
    pageTitle?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
    timeOnPage?: IntNullableFilter<"PageView"> | number | null
    scrollDepth?: IntNullableFilter<"PageView"> | number | null
    exitPage?: BoolFilter<"PageView"> | boolean
    bounce?: BoolFilter<"PageView"> | boolean
    timestamp?: DateTimeFilter<"PageView"> | Date | string
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PageViewOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    pagePath?: SortOrder
    pageTitle?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    timeOnPage?: SortOrderInput | SortOrder
    scrollDepth?: SortOrderInput | SortOrder
    exitPage?: SortOrder
    bounce?: SortOrder
    timestamp?: SortOrder
    session?: UserSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type PageViewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PageViewWhereInput | PageViewWhereInput[]
    OR?: PageViewWhereInput[]
    NOT?: PageViewWhereInput | PageViewWhereInput[]
    sessionId?: UuidFilter<"PageView"> | string
    userId?: UuidNullableFilter<"PageView"> | string | null
    pagePath?: StringFilter<"PageView"> | string
    pageTitle?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
    timeOnPage?: IntNullableFilter<"PageView"> | number | null
    scrollDepth?: IntNullableFilter<"PageView"> | number | null
    exitPage?: BoolFilter<"PageView"> | boolean
    bounce?: BoolFilter<"PageView"> | boolean
    timestamp?: DateTimeFilter<"PageView"> | Date | string
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type PageViewOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    pagePath?: SortOrder
    pageTitle?: SortOrderInput | SortOrder
    referrer?: SortOrderInput | SortOrder
    timeOnPage?: SortOrderInput | SortOrder
    scrollDepth?: SortOrderInput | SortOrder
    exitPage?: SortOrder
    bounce?: SortOrder
    timestamp?: SortOrder
    _count?: PageViewCountOrderByAggregateInput
    _avg?: PageViewAvgOrderByAggregateInput
    _max?: PageViewMaxOrderByAggregateInput
    _min?: PageViewMinOrderByAggregateInput
    _sum?: PageViewSumOrderByAggregateInput
  }

  export type PageViewScalarWhereWithAggregatesInput = {
    AND?: PageViewScalarWhereWithAggregatesInput | PageViewScalarWhereWithAggregatesInput[]
    OR?: PageViewScalarWhereWithAggregatesInput[]
    NOT?: PageViewScalarWhereWithAggregatesInput | PageViewScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PageView"> | string
    sessionId?: UuidWithAggregatesFilter<"PageView"> | string
    userId?: UuidNullableWithAggregatesFilter<"PageView"> | string | null
    pagePath?: StringWithAggregatesFilter<"PageView"> | string
    pageTitle?: StringNullableWithAggregatesFilter<"PageView"> | string | null
    referrer?: StringNullableWithAggregatesFilter<"PageView"> | string | null
    timeOnPage?: IntNullableWithAggregatesFilter<"PageView"> | number | null
    scrollDepth?: IntNullableWithAggregatesFilter<"PageView"> | number | null
    exitPage?: BoolWithAggregatesFilter<"PageView"> | boolean
    bounce?: BoolWithAggregatesFilter<"PageView"> | boolean
    timestamp?: DateTimeWithAggregatesFilter<"PageView"> | Date | string
  }

  export type ChatAnalyticsWhereInput = {
    AND?: ChatAnalyticsWhereInput | ChatAnalyticsWhereInput[]
    OR?: ChatAnalyticsWhereInput[]
    NOT?: ChatAnalyticsWhereInput | ChatAnalyticsWhereInput[]
    id?: UuidFilter<"ChatAnalytics"> | string
    sessionId?: UuidFilter<"ChatAnalytics"> | string
    userId?: UuidNullableFilter<"ChatAnalytics"> | string | null
    conversationId?: StringFilter<"ChatAnalytics"> | string
    messageCount?: IntFilter<"ChatAnalytics"> | number
    sessionDuration?: IntNullableFilter<"ChatAnalytics"> | number | null
    selectedArticle?: StringNullableFilter<"ChatAnalytics"> | string | null
    selectedContentType?: StringNullableFilter<"ChatAnalytics"> | string | null
    tokensUsed?: IntNullableFilter<"ChatAnalytics"> | number | null
    errorCount?: IntFilter<"ChatAnalytics"> | number
    startedAt?: DateTimeFilter<"ChatAnalytics"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatAnalytics"> | Date | string | null
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ChatAnalyticsOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    conversationId?: SortOrder
    messageCount?: SortOrder
    sessionDuration?: SortOrderInput | SortOrder
    selectedArticle?: SortOrderInput | SortOrder
    selectedContentType?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    errorCount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    session?: UserSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ChatAnalyticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatAnalyticsWhereInput | ChatAnalyticsWhereInput[]
    OR?: ChatAnalyticsWhereInput[]
    NOT?: ChatAnalyticsWhereInput | ChatAnalyticsWhereInput[]
    sessionId?: UuidFilter<"ChatAnalytics"> | string
    userId?: UuidNullableFilter<"ChatAnalytics"> | string | null
    conversationId?: StringFilter<"ChatAnalytics"> | string
    messageCount?: IntFilter<"ChatAnalytics"> | number
    sessionDuration?: IntNullableFilter<"ChatAnalytics"> | number | null
    selectedArticle?: StringNullableFilter<"ChatAnalytics"> | string | null
    selectedContentType?: StringNullableFilter<"ChatAnalytics"> | string | null
    tokensUsed?: IntNullableFilter<"ChatAnalytics"> | number | null
    errorCount?: IntFilter<"ChatAnalytics"> | number
    startedAt?: DateTimeFilter<"ChatAnalytics"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatAnalytics"> | Date | string | null
    session?: XOR<UserSessionScalarRelationFilter, UserSessionWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ChatAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrderInput | SortOrder
    conversationId?: SortOrder
    messageCount?: SortOrder
    sessionDuration?: SortOrderInput | SortOrder
    selectedArticle?: SortOrderInput | SortOrder
    selectedContentType?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    errorCount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    _count?: ChatAnalyticsCountOrderByAggregateInput
    _avg?: ChatAnalyticsAvgOrderByAggregateInput
    _max?: ChatAnalyticsMaxOrderByAggregateInput
    _min?: ChatAnalyticsMinOrderByAggregateInput
    _sum?: ChatAnalyticsSumOrderByAggregateInput
  }

  export type ChatAnalyticsScalarWhereWithAggregatesInput = {
    AND?: ChatAnalyticsScalarWhereWithAggregatesInput | ChatAnalyticsScalarWhereWithAggregatesInput[]
    OR?: ChatAnalyticsScalarWhereWithAggregatesInput[]
    NOT?: ChatAnalyticsScalarWhereWithAggregatesInput | ChatAnalyticsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChatAnalytics"> | string
    sessionId?: UuidWithAggregatesFilter<"ChatAnalytics"> | string
    userId?: UuidNullableWithAggregatesFilter<"ChatAnalytics"> | string | null
    conversationId?: StringWithAggregatesFilter<"ChatAnalytics"> | string
    messageCount?: IntWithAggregatesFilter<"ChatAnalytics"> | number
    sessionDuration?: IntNullableWithAggregatesFilter<"ChatAnalytics"> | number | null
    selectedArticle?: StringNullableWithAggregatesFilter<"ChatAnalytics"> | string | null
    selectedContentType?: StringNullableWithAggregatesFilter<"ChatAnalytics"> | string | null
    tokensUsed?: IntNullableWithAggregatesFilter<"ChatAnalytics"> | number | null
    errorCount?: IntWithAggregatesFilter<"ChatAnalytics"> | number
    startedAt?: DateTimeWithAggregatesFilter<"ChatAnalytics"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"ChatAnalytics"> | Date | string | null
  }

  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: UuidFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    content?: StringNullableFilter<"Article"> | string | null
    contentType?: StringFilter<"Article"> | string
    articleTopic?: StringNullableFilter<"Article"> | string | null
    category?: StringNullableFilter<"Article"> | string | null
    tags?: StringNullableListFilter<"Article">
    defaultKeyInsights?: StringNullableListFilter<"Article">
    defaultVideoScript?: StringNullableFilter<"Article"> | string | null
    defaultEmailTemplate?: StringNullableFilter<"Article"> | string | null
    defaultSocialContent?: JsonNullableFilter<"Article">
    position?: IntFilter<"Article"> | number
    imageUrl?: StringNullableFilter<"Article"> | string | null
    sourceUrl?: StringNullableFilter<"Article"> | string | null
    metadata?: JsonNullableFilter<"Article">
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    createdByAdminId?: UuidNullableFilter<"Article"> | string | null
    lastEditedByAdminId?: UuidNullableFilter<"Article"> | string | null
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    lastEditedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    personalizations?: PersonalizedOutputListRelationFilter
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    contentType?: SortOrder
    articleTopic?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    tags?: SortOrder
    defaultKeyInsights?: SortOrder
    defaultVideoScript?: SortOrderInput | SortOrder
    defaultEmailTemplate?: SortOrderInput | SortOrder
    defaultSocialContent?: SortOrderInput | SortOrder
    position?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    status?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByAdminId?: SortOrderInput | SortOrder
    lastEditedByAdminId?: SortOrderInput | SortOrder
    createdBy?: UserOrderByWithRelationInput
    lastEditedBy?: UserOrderByWithRelationInput
    personalizations?: PersonalizedOutputOrderByRelationAggregateInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    content?: StringNullableFilter<"Article"> | string | null
    contentType?: StringFilter<"Article"> | string
    articleTopic?: StringNullableFilter<"Article"> | string | null
    category?: StringNullableFilter<"Article"> | string | null
    tags?: StringNullableListFilter<"Article">
    defaultKeyInsights?: StringNullableListFilter<"Article">
    defaultVideoScript?: StringNullableFilter<"Article"> | string | null
    defaultEmailTemplate?: StringNullableFilter<"Article"> | string | null
    defaultSocialContent?: JsonNullableFilter<"Article">
    position?: IntFilter<"Article"> | number
    imageUrl?: StringNullableFilter<"Article"> | string | null
    sourceUrl?: StringNullableFilter<"Article"> | string | null
    metadata?: JsonNullableFilter<"Article">
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    createdByAdminId?: UuidNullableFilter<"Article"> | string | null
    lastEditedByAdminId?: UuidNullableFilter<"Article"> | string | null
    createdBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    lastEditedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    personalizations?: PersonalizedOutputListRelationFilter
  }, "id">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    contentType?: SortOrder
    articleTopic?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    tags?: SortOrder
    defaultKeyInsights?: SortOrder
    defaultVideoScript?: SortOrderInput | SortOrder
    defaultEmailTemplate?: SortOrderInput | SortOrder
    defaultSocialContent?: SortOrderInput | SortOrder
    position?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    status?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByAdminId?: SortOrderInput | SortOrder
    lastEditedByAdminId?: SortOrderInput | SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _avg?: ArticleAvgOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
    _sum?: ArticleSumOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    summary?: StringNullableWithAggregatesFilter<"Article"> | string | null
    content?: StringNullableWithAggregatesFilter<"Article"> | string | null
    contentType?: StringWithAggregatesFilter<"Article"> | string
    articleTopic?: StringNullableWithAggregatesFilter<"Article"> | string | null
    category?: StringNullableWithAggregatesFilter<"Article"> | string | null
    tags?: StringNullableListFilter<"Article">
    defaultKeyInsights?: StringNullableListFilter<"Article">
    defaultVideoScript?: StringNullableWithAggregatesFilter<"Article"> | string | null
    defaultEmailTemplate?: StringNullableWithAggregatesFilter<"Article"> | string | null
    defaultSocialContent?: JsonNullableWithAggregatesFilter<"Article">
    position?: IntWithAggregatesFilter<"Article"> | number
    imageUrl?: StringNullableWithAggregatesFilter<"Article"> | string | null
    sourceUrl?: StringNullableWithAggregatesFilter<"Article"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Article">
    status?: EnumArticleStatusWithAggregatesFilter<"Article"> | $Enums.ArticleStatus
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Article"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    createdByAdminId?: UuidNullableWithAggregatesFilter<"Article"> | string | null
    lastEditedByAdminId?: UuidNullableWithAggregatesFilter<"Article"> | string | null
  }

  export type PersonalizedOutputWhereInput = {
    AND?: PersonalizedOutputWhereInput | PersonalizedOutputWhereInput[]
    OR?: PersonalizedOutputWhereInput[]
    NOT?: PersonalizedOutputWhereInput | PersonalizedOutputWhereInput[]
    id?: UuidFilter<"PersonalizedOutput"> | string
    userId?: UuidFilter<"PersonalizedOutput"> | string
    articleId?: UuidFilter<"PersonalizedOutput"> | string
    personalizedKeyInsights?: StringNullableListFilter<"PersonalizedOutput">
    personalizedVideoScript?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedEmailTemplate?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedSocialContent?: JsonNullableFilter<"PersonalizedOutput">
    truetoneSettings?: JsonNullableFilter<"PersonalizedOutput">
    tokensUsed?: IntNullableFilter<"PersonalizedOutput"> | number | null
    generationCount?: IntFilter<"PersonalizedOutput"> | number
    lastGeneratedAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
    createdAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type PersonalizedOutputOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    personalizedKeyInsights?: SortOrder
    personalizedVideoScript?: SortOrderInput | SortOrder
    personalizedEmailTemplate?: SortOrderInput | SortOrder
    personalizedSocialContent?: SortOrderInput | SortOrder
    truetoneSettings?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    generationCount?: SortOrder
    lastGeneratedAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    article?: ArticleOrderByWithRelationInput
  }

  export type PersonalizedOutputWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_articleId?: PersonalizedOutputUserIdArticleIdCompoundUniqueInput
    AND?: PersonalizedOutputWhereInput | PersonalizedOutputWhereInput[]
    OR?: PersonalizedOutputWhereInput[]
    NOT?: PersonalizedOutputWhereInput | PersonalizedOutputWhereInput[]
    userId?: UuidFilter<"PersonalizedOutput"> | string
    articleId?: UuidFilter<"PersonalizedOutput"> | string
    personalizedKeyInsights?: StringNullableListFilter<"PersonalizedOutput">
    personalizedVideoScript?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedEmailTemplate?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedSocialContent?: JsonNullableFilter<"PersonalizedOutput">
    truetoneSettings?: JsonNullableFilter<"PersonalizedOutput">
    tokensUsed?: IntNullableFilter<"PersonalizedOutput"> | number | null
    generationCount?: IntFilter<"PersonalizedOutput"> | number
    lastGeneratedAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
    createdAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "userId_articleId">

  export type PersonalizedOutputOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    personalizedKeyInsights?: SortOrder
    personalizedVideoScript?: SortOrderInput | SortOrder
    personalizedEmailTemplate?: SortOrderInput | SortOrder
    personalizedSocialContent?: SortOrderInput | SortOrder
    truetoneSettings?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    generationCount?: SortOrder
    lastGeneratedAt?: SortOrder
    createdAt?: SortOrder
    _count?: PersonalizedOutputCountOrderByAggregateInput
    _avg?: PersonalizedOutputAvgOrderByAggregateInput
    _max?: PersonalizedOutputMaxOrderByAggregateInput
    _min?: PersonalizedOutputMinOrderByAggregateInput
    _sum?: PersonalizedOutputSumOrderByAggregateInput
  }

  export type PersonalizedOutputScalarWhereWithAggregatesInput = {
    AND?: PersonalizedOutputScalarWhereWithAggregatesInput | PersonalizedOutputScalarWhereWithAggregatesInput[]
    OR?: PersonalizedOutputScalarWhereWithAggregatesInput[]
    NOT?: PersonalizedOutputScalarWhereWithAggregatesInput | PersonalizedOutputScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PersonalizedOutput"> | string
    userId?: UuidWithAggregatesFilter<"PersonalizedOutput"> | string
    articleId?: UuidWithAggregatesFilter<"PersonalizedOutput"> | string
    personalizedKeyInsights?: StringNullableListFilter<"PersonalizedOutput">
    personalizedVideoScript?: StringNullableWithAggregatesFilter<"PersonalizedOutput"> | string | null
    personalizedEmailTemplate?: StringNullableWithAggregatesFilter<"PersonalizedOutput"> | string | null
    personalizedSocialContent?: JsonNullableWithAggregatesFilter<"PersonalizedOutput">
    truetoneSettings?: JsonNullableWithAggregatesFilter<"PersonalizedOutput">
    tokensUsed?: IntNullableWithAggregatesFilter<"PersonalizedOutput"> | number | null
    generationCount?: IntWithAggregatesFilter<"PersonalizedOutput"> | number
    lastGeneratedAt?: DateTimeWithAggregatesFilter<"PersonalizedOutput"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"PersonalizedOutput"> | Date | string
  }

  export type AnonymousAiUsageWhereInput = {
    AND?: AnonymousAiUsageWhereInput | AnonymousAiUsageWhereInput[]
    OR?: AnonymousAiUsageWhereInput[]
    NOT?: AnonymousAiUsageWhereInput | AnonymousAiUsageWhereInput[]
    id?: UuidFilter<"AnonymousAiUsage"> | string
    sessionId?: StringFilter<"AnonymousAiUsage"> | string
    ipAddress?: StringNullableFilter<"AnonymousAiUsage"> | string | null
    generationsUsed?: IntFilter<"AnonymousAiUsage"> | number
    createdAt?: DateTimeFilter<"AnonymousAiUsage"> | Date | string
    lastUsedAt?: DateTimeFilter<"AnonymousAiUsage"> | Date | string
  }

  export type AnonymousAiUsageOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    generationsUsed?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type AnonymousAiUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId?: string
    AND?: AnonymousAiUsageWhereInput | AnonymousAiUsageWhereInput[]
    OR?: AnonymousAiUsageWhereInput[]
    NOT?: AnonymousAiUsageWhereInput | AnonymousAiUsageWhereInput[]
    ipAddress?: StringNullableFilter<"AnonymousAiUsage"> | string | null
    generationsUsed?: IntFilter<"AnonymousAiUsage"> | number
    createdAt?: DateTimeFilter<"AnonymousAiUsage"> | Date | string
    lastUsedAt?: DateTimeFilter<"AnonymousAiUsage"> | Date | string
  }, "id" | "sessionId">

  export type AnonymousAiUsageOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    generationsUsed?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
    _count?: AnonymousAiUsageCountOrderByAggregateInput
    _avg?: AnonymousAiUsageAvgOrderByAggregateInput
    _max?: AnonymousAiUsageMaxOrderByAggregateInput
    _min?: AnonymousAiUsageMinOrderByAggregateInput
    _sum?: AnonymousAiUsageSumOrderByAggregateInput
  }

  export type AnonymousAiUsageScalarWhereWithAggregatesInput = {
    AND?: AnonymousAiUsageScalarWhereWithAggregatesInput | AnonymousAiUsageScalarWhereWithAggregatesInput[]
    OR?: AnonymousAiUsageScalarWhereWithAggregatesInput[]
    NOT?: AnonymousAiUsageScalarWhereWithAggregatesInput | AnonymousAiUsageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AnonymousAiUsage"> | string
    sessionId?: StringWithAggregatesFilter<"AnonymousAiUsage"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"AnonymousAiUsage"> | string | null
    generationsUsed?: IntWithAggregatesFilter<"AnonymousAiUsage"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AnonymousAiUsage"> | Date | string
    lastUsedAt?: DateTimeWithAggregatesFilter<"AnonymousAiUsage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PostCreateInput = {
    id?: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    publishedStatus?: $Enums.PublishedStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: LikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    publishedStatus?: $Enums.PublishedStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    likes?: LikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    likes?: LikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    publishedStatus?: $Enums.PublishedStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeCreateInput = {
    id?: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
    user: UserCreateNestedOneWithoutLikesInput
    post: PostCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateInput = {
    id?: string
    userId: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type LikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLikesNestedInput
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeCreateManyInput = {
    id?: string
    userId: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type LikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    user?: UserCreateNestedOneWithoutSessionsInput
    events?: AnalyticsEventCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId?: string | null
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewUncheckedCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutSessionsNestedInput
    events?: AnalyticsEventUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    events?: AnalyticsEventUncheckedUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUncheckedUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId?: string | null
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
  }

  export type AnalyticsEventCreateInput = {
    id?: string
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
    session: UserSessionCreateNestedOneWithoutEventsInput
    user?: UserCreateNestedOneWithoutEventsInput
  }

  export type AnalyticsEventUncheckedCreateInput = {
    id?: string
    sessionId: string
    userId?: string | null
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type AnalyticsEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UserSessionUpdateOneRequiredWithoutEventsNestedInput
    user?: UserUpdateOneWithoutEventsNestedInput
  }

  export type AnalyticsEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventCreateManyInput = {
    id?: string
    sessionId: string
    userId?: string | null
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type AnalyticsEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewCreateInput = {
    id?: string
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
    session: UserSessionCreateNestedOneWithoutPageViewsRelInput
    user?: UserCreateNestedOneWithoutPageViewsInput
  }

  export type PageViewUncheckedCreateInput = {
    id?: string
    sessionId: string
    userId?: string | null
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type PageViewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UserSessionUpdateOneRequiredWithoutPageViewsRelNestedInput
    user?: UserUpdateOneWithoutPageViewsNestedInput
  }

  export type PageViewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewCreateManyInput = {
    id?: string
    sessionId: string
    userId?: string | null
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type PageViewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatAnalyticsCreateInput = {
    id?: string
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
    session: UserSessionCreateNestedOneWithoutChatSessionsInput
    user?: UserCreateNestedOneWithoutChatAnalyticsInput
  }

  export type ChatAnalyticsUncheckedCreateInput = {
    id?: string
    sessionId: string
    userId?: string | null
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ChatAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    session?: UserSessionUpdateOneRequiredWithoutChatSessionsNestedInput
    user?: UserUpdateOneWithoutChatAnalyticsNestedInput
  }

  export type ChatAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatAnalyticsCreateManyInput = {
    id?: string
    sessionId: string
    userId?: string | null
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ChatAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedArticlesInput
    lastEditedBy?: UserCreateNestedOneWithoutEditedArticlesInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByAdminId?: string | null
    lastEditedByAdminId?: string | null
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedArticlesNestedInput
    lastEditedBy?: UserUpdateOneWithoutEditedArticlesNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    lastEditedByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByAdminId?: string | null
    lastEditedByAdminId?: string | null
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    lastEditedByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PersonalizedOutputCreateInput = {
    id?: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPersonalizationsInput
    article: ArticleCreateNestedOneWithoutPersonalizationsInput
  }

  export type PersonalizedOutputUncheckedCreateInput = {
    id?: string
    userId: string
    articleId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type PersonalizedOutputUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPersonalizationsNestedInput
    article?: ArticleUpdateOneRequiredWithoutPersonalizationsNestedInput
  }

  export type PersonalizedOutputUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonalizedOutputCreateManyInput = {
    id?: string
    userId: string
    articleId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type PersonalizedOutputUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonalizedOutputUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousAiUsageCreateInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    generationsUsed?: number
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type AnonymousAiUsageUncheckedCreateInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    generationsUsed?: number
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type AnonymousAiUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    generationsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousAiUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    generationsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousAiUsageCreateManyInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    generationsUsed?: number
    createdAt?: Date | string
    lastUsedAt?: Date | string
  }

  export type AnonymousAiUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    generationsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnonymousAiUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    generationsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LikeListRelationFilter = {
    every?: LikeWhereInput
    some?: LikeWhereInput
    none?: LikeWhereInput
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type AnalyticsEventListRelationFilter = {
    every?: AnalyticsEventWhereInput
    some?: AnalyticsEventWhereInput
    none?: AnalyticsEventWhereInput
  }

  export type PageViewListRelationFilter = {
    every?: PageViewWhereInput
    some?: PageViewWhereInput
    none?: PageViewWhereInput
  }

  export type ChatAnalyticsListRelationFilter = {
    every?: ChatAnalyticsWhereInput
    some?: ChatAnalyticsWhereInput
    none?: ChatAnalyticsWhereInput
  }

  export type ArticleListRelationFilter = {
    every?: ArticleWhereInput
    some?: ArticleWhereInput
    none?: ArticleWhereInput
  }

  export type PersonalizedOutputListRelationFilter = {
    every?: PersonalizedOutputWhereInput
    some?: PersonalizedOutputWhereInput
    none?: PersonalizedOutputWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AnalyticsEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PageViewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatAnalyticsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PersonalizedOutputOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    company?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kindeId?: SortOrder
    categoryPreferences?: SortOrder
    savedArticleIds?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCreatedAt?: SortOrder
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    generationResetDate?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    hasCompletedOnboarding?: SortOrder
    onboardingStep?: SortOrder
    onboardingCompletedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    onboardingStep?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    company?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kindeId?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCreatedAt?: SortOrder
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    generationResetDate?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    hasCompletedOnboarding?: SortOrder
    onboardingStep?: SortOrder
    onboardingCompletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    company?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kindeId?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCreatedAt?: SortOrder
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    generationResetDate?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    stripePriceId?: SortOrder
    hasCompletedOnboarding?: SortOrder
    onboardingStep?: SortOrder
    onboardingCompletedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    monthlyGenerationLimit?: SortOrder
    monthlyGenerationsUsed?: SortOrder
    onboardingStep?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumPublishedStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PublishedStatus | EnumPublishedStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPublishedStatusFilter<$PrismaModel> | $Enums.PublishedStatus
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    publishedStatus?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    publishedStatus?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    publishedStatus?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumPublishedStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PublishedStatus | EnumPublishedStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPublishedStatusWithAggregatesFilter<$PrismaModel> | $Enums.PublishedStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPublishedStatusFilter<$PrismaModel>
    _max?: NestedEnumPublishedStatusFilter<$PrismaModel>
  }

  export type EnumContentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | EnumContentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumContentTypeFilter<$PrismaModel> | $Enums.ContentType
  }

  export type EnumDeviceFilter<$PrismaModel = never> = {
    equals?: $Enums.Device | EnumDeviceFieldRefInput<$PrismaModel>
    in?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceFilter<$PrismaModel> | $Enums.Device
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PostScalarRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type LikeUserIdPostIdContentIdContentTypeCompoundUniqueInput = {
    userId: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
  }

  export type LikeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    contentId?: SortOrder
    contentType?: SortOrder
    contentTitle?: SortOrder
    deviceType?: SortOrder
    timestamp?: SortOrder
  }

  export type LikeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    contentId?: SortOrder
    contentType?: SortOrder
    contentTitle?: SortOrder
    deviceType?: SortOrder
    timestamp?: SortOrder
  }

  export type LikeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    postId?: SortOrder
    contentId?: SortOrder
    contentType?: SortOrder
    contentTitle?: SortOrder
    deviceType?: SortOrder
    timestamp?: SortOrder
  }

  export type EnumContentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | EnumContentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumContentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ContentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentTypeFilter<$PrismaModel>
    _max?: NestedEnumContentTypeFilter<$PrismaModel>
  }

  export type EnumDeviceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Device | EnumDeviceFieldRefInput<$PrismaModel>
    in?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceWithAggregatesFilter<$PrismaModel> | $Enums.Device
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceFilter<$PrismaModel>
    _max?: NestedEnumDeviceFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    deviceType?: SortOrder
    countryCode?: SortOrder
    region?: SortOrder
    city?: SortOrder
    startedAt?: SortOrder
    lastActiveAt?: SortOrder
    endedAt?: SortOrder
    pageViews?: SortOrder
    eventsCount?: SortOrder
  }

  export type UserSessionAvgOrderByAggregateInput = {
    pageViews?: SortOrder
    eventsCount?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    deviceType?: SortOrder
    countryCode?: SortOrder
    region?: SortOrder
    city?: SortOrder
    startedAt?: SortOrder
    lastActiveAt?: SortOrder
    endedAt?: SortOrder
    pageViews?: SortOrder
    eventsCount?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    deviceType?: SortOrder
    countryCode?: SortOrder
    region?: SortOrder
    city?: SortOrder
    startedAt?: SortOrder
    lastActiveAt?: SortOrder
    endedAt?: SortOrder
    pageViews?: SortOrder
    eventsCount?: SortOrder
  }

  export type UserSessionSumOrderByAggregateInput = {
    pageViews?: SortOrder
    eventsCount?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserSessionScalarRelationFilter = {
    is?: UserSessionWhereInput
    isNot?: UserSessionWhereInput
  }

  export type AnalyticsEventCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    eventAction?: SortOrder
    eventCategory?: SortOrder
    eventLabel?: SortOrder
    eventValue?: SortOrder
    pagePath?: SortOrder
    elementId?: SortOrder
    elementType?: SortOrder
    metadata?: SortOrder
    timestamp?: SortOrder
  }

  export type AnalyticsEventAvgOrderByAggregateInput = {
    eventValue?: SortOrder
  }

  export type AnalyticsEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    eventAction?: SortOrder
    eventCategory?: SortOrder
    eventLabel?: SortOrder
    eventValue?: SortOrder
    pagePath?: SortOrder
    elementId?: SortOrder
    elementType?: SortOrder
    timestamp?: SortOrder
  }

  export type AnalyticsEventMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    eventType?: SortOrder
    eventAction?: SortOrder
    eventCategory?: SortOrder
    eventLabel?: SortOrder
    eventValue?: SortOrder
    pagePath?: SortOrder
    elementId?: SortOrder
    elementType?: SortOrder
    timestamp?: SortOrder
  }

  export type AnalyticsEventSumOrderByAggregateInput = {
    eventValue?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type PageViewCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    pagePath?: SortOrder
    pageTitle?: SortOrder
    referrer?: SortOrder
    timeOnPage?: SortOrder
    scrollDepth?: SortOrder
    exitPage?: SortOrder
    bounce?: SortOrder
    timestamp?: SortOrder
  }

  export type PageViewAvgOrderByAggregateInput = {
    timeOnPage?: SortOrder
    scrollDepth?: SortOrder
  }

  export type PageViewMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    pagePath?: SortOrder
    pageTitle?: SortOrder
    referrer?: SortOrder
    timeOnPage?: SortOrder
    scrollDepth?: SortOrder
    exitPage?: SortOrder
    bounce?: SortOrder
    timestamp?: SortOrder
  }

  export type PageViewMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    pagePath?: SortOrder
    pageTitle?: SortOrder
    referrer?: SortOrder
    timeOnPage?: SortOrder
    scrollDepth?: SortOrder
    exitPage?: SortOrder
    bounce?: SortOrder
    timestamp?: SortOrder
  }

  export type PageViewSumOrderByAggregateInput = {
    timeOnPage?: SortOrder
    scrollDepth?: SortOrder
  }

  export type ChatAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    conversationId?: SortOrder
    messageCount?: SortOrder
    sessionDuration?: SortOrder
    selectedArticle?: SortOrder
    selectedContentType?: SortOrder
    tokensUsed?: SortOrder
    errorCount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ChatAnalyticsAvgOrderByAggregateInput = {
    messageCount?: SortOrder
    sessionDuration?: SortOrder
    tokensUsed?: SortOrder
    errorCount?: SortOrder
  }

  export type ChatAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    conversationId?: SortOrder
    messageCount?: SortOrder
    sessionDuration?: SortOrder
    selectedArticle?: SortOrder
    selectedContentType?: SortOrder
    tokensUsed?: SortOrder
    errorCount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ChatAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    conversationId?: SortOrder
    messageCount?: SortOrder
    sessionDuration?: SortOrder
    selectedArticle?: SortOrder
    selectedContentType?: SortOrder
    tokensUsed?: SortOrder
    errorCount?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ChatAnalyticsSumOrderByAggregateInput = {
    messageCount?: SortOrder
    sessionDuration?: SortOrder
    tokensUsed?: SortOrder
    errorCount?: SortOrder
  }

  export type EnumArticleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArticleStatusFilter<$PrismaModel> | $Enums.ArticleStatus
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    articleTopic?: SortOrder
    category?: SortOrder
    tags?: SortOrder
    defaultKeyInsights?: SortOrder
    defaultVideoScript?: SortOrder
    defaultEmailTemplate?: SortOrder
    defaultSocialContent?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    sourceUrl?: SortOrder
    metadata?: SortOrder
    status?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByAdminId?: SortOrder
    lastEditedByAdminId?: SortOrder
  }

  export type ArticleAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    articleTopic?: SortOrder
    category?: SortOrder
    defaultVideoScript?: SortOrder
    defaultEmailTemplate?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByAdminId?: SortOrder
    lastEditedByAdminId?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    content?: SortOrder
    contentType?: SortOrder
    articleTopic?: SortOrder
    category?: SortOrder
    defaultVideoScript?: SortOrder
    defaultEmailTemplate?: SortOrder
    position?: SortOrder
    imageUrl?: SortOrder
    sourceUrl?: SortOrder
    status?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdByAdminId?: SortOrder
    lastEditedByAdminId?: SortOrder
  }

  export type ArticleSumOrderByAggregateInput = {
    position?: SortOrder
  }

  export type EnumArticleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArticleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleStatusFilter<$PrismaModel>
    _max?: NestedEnumArticleStatusFilter<$PrismaModel>
  }

  export type ArticleScalarRelationFilter = {
    is?: ArticleWhereInput
    isNot?: ArticleWhereInput
  }

  export type PersonalizedOutputUserIdArticleIdCompoundUniqueInput = {
    userId: string
    articleId: string
  }

  export type PersonalizedOutputCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    personalizedKeyInsights?: SortOrder
    personalizedVideoScript?: SortOrder
    personalizedEmailTemplate?: SortOrder
    personalizedSocialContent?: SortOrder
    truetoneSettings?: SortOrder
    tokensUsed?: SortOrder
    generationCount?: SortOrder
    lastGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonalizedOutputAvgOrderByAggregateInput = {
    tokensUsed?: SortOrder
    generationCount?: SortOrder
  }

  export type PersonalizedOutputMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    personalizedVideoScript?: SortOrder
    personalizedEmailTemplate?: SortOrder
    tokensUsed?: SortOrder
    generationCount?: SortOrder
    lastGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonalizedOutputMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    personalizedVideoScript?: SortOrder
    personalizedEmailTemplate?: SortOrder
    tokensUsed?: SortOrder
    generationCount?: SortOrder
    lastGeneratedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PersonalizedOutputSumOrderByAggregateInput = {
    tokensUsed?: SortOrder
    generationCount?: SortOrder
  }

  export type AnonymousAiUsageCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    generationsUsed?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type AnonymousAiUsageAvgOrderByAggregateInput = {
    generationsUsed?: SortOrder
  }

  export type AnonymousAiUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    generationsUsed?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type AnonymousAiUsageMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    generationsUsed?: SortOrder
    createdAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type AnonymousAiUsageSumOrderByAggregateInput = {
    generationsUsed?: SortOrder
  }

  export type UserCreatecategoryPreferencesInput = {
    set: string[]
  }

  export type UserCreatesavedArticleIdsInput = {
    set: string[]
  }

  export type LikeCreateNestedManyWithoutUserInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type AnalyticsEventCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type PageViewCreateNestedManyWithoutUserInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ChatAnalyticsCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput> | ChatAnalyticsCreateWithoutUserInput[] | ChatAnalyticsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutUserInput | ChatAnalyticsCreateOrConnectWithoutUserInput[]
    createMany?: ChatAnalyticsCreateManyUserInputEnvelope
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
  }

  export type ArticleCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput> | ArticleCreateWithoutCreatedByInput[] | ArticleUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCreatedByInput | ArticleCreateOrConnectWithoutCreatedByInput[]
    createMany?: ArticleCreateManyCreatedByInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type ArticleCreateNestedManyWithoutLastEditedByInput = {
    create?: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput> | ArticleCreateWithoutLastEditedByInput[] | ArticleUncheckedCreateWithoutLastEditedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutLastEditedByInput | ArticleCreateOrConnectWithoutLastEditedByInput[]
    createMany?: ArticleCreateManyLastEditedByInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type PersonalizedOutputCreateNestedManyWithoutUserInput = {
    create?: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput> | PersonalizedOutputCreateWithoutUserInput[] | PersonalizedOutputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutUserInput | PersonalizedOutputCreateOrConnectWithoutUserInput[]
    createMany?: PersonalizedOutputCreateManyUserInputEnvelope
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
  }

  export type LikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type AnalyticsEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type PageViewUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput> | ChatAnalyticsCreateWithoutUserInput[] | ChatAnalyticsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutUserInput | ChatAnalyticsCreateOrConnectWithoutUserInput[]
    createMany?: ChatAnalyticsCreateManyUserInputEnvelope
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput> | ArticleCreateWithoutCreatedByInput[] | ArticleUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCreatedByInput | ArticleCreateOrConnectWithoutCreatedByInput[]
    createMany?: ArticleCreateManyCreatedByInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutLastEditedByInput = {
    create?: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput> | ArticleCreateWithoutLastEditedByInput[] | ArticleUncheckedCreateWithoutLastEditedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutLastEditedByInput | ArticleCreateOrConnectWithoutLastEditedByInput[]
    createMany?: ArticleCreateManyLastEditedByInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput> | PersonalizedOutputCreateWithoutUserInput[] | PersonalizedOutputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutUserInput | PersonalizedOutputCreateOrConnectWithoutUserInput[]
    createMany?: PersonalizedOutputCreateManyUserInputEnvelope
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdatecategoryPreferencesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdatesavedArticleIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumSubscriptionTierFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionTier
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutUserInput | LikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutUserInput | LikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutUserInput | LikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type AnalyticsEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutUserInput | AnalyticsEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutUserInput | AnalyticsEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutUserInput | AnalyticsEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type PageViewUpdateManyWithoutUserNestedInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutUserInput | PageViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutUserInput | PageViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutUserInput | PageViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ChatAnalyticsUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput> | ChatAnalyticsCreateWithoutUserInput[] | ChatAnalyticsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutUserInput | ChatAnalyticsCreateOrConnectWithoutUserInput[]
    upsert?: ChatAnalyticsUpsertWithWhereUniqueWithoutUserInput | ChatAnalyticsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatAnalyticsCreateManyUserInputEnvelope
    set?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    disconnect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    delete?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    update?: ChatAnalyticsUpdateWithWhereUniqueWithoutUserInput | ChatAnalyticsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatAnalyticsUpdateManyWithWhereWithoutUserInput | ChatAnalyticsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
  }

  export type ArticleUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput> | ArticleCreateWithoutCreatedByInput[] | ArticleUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCreatedByInput | ArticleCreateOrConnectWithoutCreatedByInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutCreatedByInput | ArticleUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ArticleCreateManyCreatedByInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutCreatedByInput | ArticleUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutCreatedByInput | ArticleUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type ArticleUpdateManyWithoutLastEditedByNestedInput = {
    create?: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput> | ArticleCreateWithoutLastEditedByInput[] | ArticleUncheckedCreateWithoutLastEditedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutLastEditedByInput | ArticleCreateOrConnectWithoutLastEditedByInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutLastEditedByInput | ArticleUpsertWithWhereUniqueWithoutLastEditedByInput[]
    createMany?: ArticleCreateManyLastEditedByInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutLastEditedByInput | ArticleUpdateWithWhereUniqueWithoutLastEditedByInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutLastEditedByInput | ArticleUpdateManyWithWhereWithoutLastEditedByInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type PersonalizedOutputUpdateManyWithoutUserNestedInput = {
    create?: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput> | PersonalizedOutputCreateWithoutUserInput[] | PersonalizedOutputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutUserInput | PersonalizedOutputCreateOrConnectWithoutUserInput[]
    upsert?: PersonalizedOutputUpsertWithWhereUniqueWithoutUserInput | PersonalizedOutputUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PersonalizedOutputCreateManyUserInputEnvelope
    set?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    disconnect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    delete?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    update?: PersonalizedOutputUpdateWithWhereUniqueWithoutUserInput | PersonalizedOutputUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PersonalizedOutputUpdateManyWithWhereWithoutUserInput | PersonalizedOutputUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
  }

  export type LikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput> | LikeCreateWithoutUserInput[] | LikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutUserInput | LikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LikeCreateManyUserInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutUserInput | LikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutUserInput | LikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput> | AnalyticsEventCreateWithoutUserInput[] | AnalyticsEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutUserInput | AnalyticsEventCreateOrConnectWithoutUserInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutUserInput | AnalyticsEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AnalyticsEventCreateManyUserInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutUserInput | AnalyticsEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutUserInput | AnalyticsEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type PageViewUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput> | PageViewCreateWithoutUserInput[] | PageViewUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutUserInput | PageViewCreateOrConnectWithoutUserInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutUserInput | PageViewUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PageViewCreateManyUserInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutUserInput | PageViewUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutUserInput | PageViewUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput> | ChatAnalyticsCreateWithoutUserInput[] | ChatAnalyticsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutUserInput | ChatAnalyticsCreateOrConnectWithoutUserInput[]
    upsert?: ChatAnalyticsUpsertWithWhereUniqueWithoutUserInput | ChatAnalyticsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatAnalyticsCreateManyUserInputEnvelope
    set?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    disconnect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    delete?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    update?: ChatAnalyticsUpdateWithWhereUniqueWithoutUserInput | ChatAnalyticsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatAnalyticsUpdateManyWithWhereWithoutUserInput | ChatAnalyticsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput> | ArticleCreateWithoutCreatedByInput[] | ArticleUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutCreatedByInput | ArticleCreateOrConnectWithoutCreatedByInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutCreatedByInput | ArticleUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: ArticleCreateManyCreatedByInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutCreatedByInput | ArticleUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutCreatedByInput | ArticleUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput = {
    create?: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput> | ArticleCreateWithoutLastEditedByInput[] | ArticleUncheckedCreateWithoutLastEditedByInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutLastEditedByInput | ArticleCreateOrConnectWithoutLastEditedByInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutLastEditedByInput | ArticleUpsertWithWhereUniqueWithoutLastEditedByInput[]
    createMany?: ArticleCreateManyLastEditedByInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutLastEditedByInput | ArticleUpdateWithWhereUniqueWithoutLastEditedByInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutLastEditedByInput | ArticleUpdateManyWithWhereWithoutLastEditedByInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput> | PersonalizedOutputCreateWithoutUserInput[] | PersonalizedOutputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutUserInput | PersonalizedOutputCreateOrConnectWithoutUserInput[]
    upsert?: PersonalizedOutputUpsertWithWhereUniqueWithoutUserInput | PersonalizedOutputUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PersonalizedOutputCreateManyUserInputEnvelope
    set?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    disconnect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    delete?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    update?: PersonalizedOutputUpdateWithWhereUniqueWithoutUserInput | PersonalizedOutputUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PersonalizedOutputUpdateManyWithWhereWithoutUserInput | PersonalizedOutputUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
  }

  export type LikeCreateNestedManyWithoutPostInput = {
    create?: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput> | LikeCreateWithoutPostInput[] | LikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutPostInput | LikeCreateOrConnectWithoutPostInput[]
    createMany?: LikeCreateManyPostInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type LikeUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput> | LikeCreateWithoutPostInput[] | LikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutPostInput | LikeCreateOrConnectWithoutPostInput[]
    createMany?: LikeCreateManyPostInputEnvelope
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
  }

  export type EnumPublishedStatusFieldUpdateOperationsInput = {
    set?: $Enums.PublishedStatus
  }

  export type LikeUpdateManyWithoutPostNestedInput = {
    create?: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput> | LikeCreateWithoutPostInput[] | LikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutPostInput | LikeCreateOrConnectWithoutPostInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutPostInput | LikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: LikeCreateManyPostInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutPostInput | LikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutPostInput | LikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type LikeUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput> | LikeCreateWithoutPostInput[] | LikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: LikeCreateOrConnectWithoutPostInput | LikeCreateOrConnectWithoutPostInput[]
    upsert?: LikeUpsertWithWhereUniqueWithoutPostInput | LikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: LikeCreateManyPostInputEnvelope
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[]
    update?: LikeUpdateWithWhereUniqueWithoutPostInput | LikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: LikeUpdateManyWithWhereWithoutPostInput | LikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLikesInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    connect?: UserWhereUniqueInput
  }

  export type PostCreateNestedOneWithoutLikesInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    connect?: PostWhereUniqueInput
  }

  export type EnumContentTypeFieldUpdateOperationsInput = {
    set?: $Enums.ContentType
  }

  export type EnumDeviceFieldUpdateOperationsInput = {
    set?: $Enums.Device
  }

  export type UserUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput
    upsert?: UserUpsertWithoutLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLikesInput, UserUpdateWithoutLikesInput>, UserUncheckedUpdateWithoutLikesInput>
  }

  export type PostUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput
    upsert?: PostUpsertWithoutLikesInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutLikesInput, PostUpdateWithoutLikesInput>, PostUncheckedUpdateWithoutLikesInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type AnalyticsEventCreateNestedManyWithoutSessionInput = {
    create?: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput> | AnalyticsEventCreateWithoutSessionInput[] | AnalyticsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutSessionInput | AnalyticsEventCreateOrConnectWithoutSessionInput[]
    createMany?: AnalyticsEventCreateManySessionInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type PageViewCreateNestedManyWithoutSessionInput = {
    create?: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput> | PageViewCreateWithoutSessionInput[] | PageViewUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutSessionInput | PageViewCreateOrConnectWithoutSessionInput[]
    createMany?: PageViewCreateManySessionInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ChatAnalyticsCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput> | ChatAnalyticsCreateWithoutSessionInput[] | ChatAnalyticsUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutSessionInput | ChatAnalyticsCreateOrConnectWithoutSessionInput[]
    createMany?: ChatAnalyticsCreateManySessionInputEnvelope
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
  }

  export type AnalyticsEventUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput> | AnalyticsEventCreateWithoutSessionInput[] | AnalyticsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutSessionInput | AnalyticsEventCreateOrConnectWithoutSessionInput[]
    createMany?: AnalyticsEventCreateManySessionInputEnvelope
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
  }

  export type PageViewUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput> | PageViewCreateWithoutSessionInput[] | PageViewUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutSessionInput | PageViewCreateOrConnectWithoutSessionInput[]
    createMany?: PageViewCreateManySessionInputEnvelope
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
  }

  export type ChatAnalyticsUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput> | ChatAnalyticsCreateWithoutSessionInput[] | ChatAnalyticsUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutSessionInput | ChatAnalyticsCreateOrConnectWithoutSessionInput[]
    createMany?: ChatAnalyticsCreateManySessionInputEnvelope
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
  }

  export type UserUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type AnalyticsEventUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput> | AnalyticsEventCreateWithoutSessionInput[] | AnalyticsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutSessionInput | AnalyticsEventCreateOrConnectWithoutSessionInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutSessionInput | AnalyticsEventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AnalyticsEventCreateManySessionInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutSessionInput | AnalyticsEventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutSessionInput | AnalyticsEventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type PageViewUpdateManyWithoutSessionNestedInput = {
    create?: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput> | PageViewCreateWithoutSessionInput[] | PageViewUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutSessionInput | PageViewCreateOrConnectWithoutSessionInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutSessionInput | PageViewUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: PageViewCreateManySessionInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutSessionInput | PageViewUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutSessionInput | PageViewUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ChatAnalyticsUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput> | ChatAnalyticsCreateWithoutSessionInput[] | ChatAnalyticsUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutSessionInput | ChatAnalyticsCreateOrConnectWithoutSessionInput[]
    upsert?: ChatAnalyticsUpsertWithWhereUniqueWithoutSessionInput | ChatAnalyticsUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatAnalyticsCreateManySessionInputEnvelope
    set?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    disconnect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    delete?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    update?: ChatAnalyticsUpdateWithWhereUniqueWithoutSessionInput | ChatAnalyticsUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatAnalyticsUpdateManyWithWhereWithoutSessionInput | ChatAnalyticsUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput> | AnalyticsEventCreateWithoutSessionInput[] | AnalyticsEventUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AnalyticsEventCreateOrConnectWithoutSessionInput | AnalyticsEventCreateOrConnectWithoutSessionInput[]
    upsert?: AnalyticsEventUpsertWithWhereUniqueWithoutSessionInput | AnalyticsEventUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AnalyticsEventCreateManySessionInputEnvelope
    set?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    disconnect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    delete?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    connect?: AnalyticsEventWhereUniqueInput | AnalyticsEventWhereUniqueInput[]
    update?: AnalyticsEventUpdateWithWhereUniqueWithoutSessionInput | AnalyticsEventUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AnalyticsEventUpdateManyWithWhereWithoutSessionInput | AnalyticsEventUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
  }

  export type PageViewUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput> | PageViewCreateWithoutSessionInput[] | PageViewUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: PageViewCreateOrConnectWithoutSessionInput | PageViewCreateOrConnectWithoutSessionInput[]
    upsert?: PageViewUpsertWithWhereUniqueWithoutSessionInput | PageViewUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: PageViewCreateManySessionInputEnvelope
    set?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    disconnect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    delete?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    connect?: PageViewWhereUniqueInput | PageViewWhereUniqueInput[]
    update?: PageViewUpdateWithWhereUniqueWithoutSessionInput | PageViewUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: PageViewUpdateManyWithWhereWithoutSessionInput | PageViewUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
  }

  export type ChatAnalyticsUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput> | ChatAnalyticsCreateWithoutSessionInput[] | ChatAnalyticsUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatAnalyticsCreateOrConnectWithoutSessionInput | ChatAnalyticsCreateOrConnectWithoutSessionInput[]
    upsert?: ChatAnalyticsUpsertWithWhereUniqueWithoutSessionInput | ChatAnalyticsUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatAnalyticsCreateManySessionInputEnvelope
    set?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    disconnect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    delete?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    connect?: ChatAnalyticsWhereUniqueInput | ChatAnalyticsWhereUniqueInput[]
    update?: ChatAnalyticsUpdateWithWhereUniqueWithoutSessionInput | ChatAnalyticsUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatAnalyticsUpdateManyWithWhereWithoutSessionInput | ChatAnalyticsUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
  }

  export type UserSessionCreateNestedOneWithoutEventsInput = {
    create?: XOR<UserSessionCreateWithoutEventsInput, UserSessionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutEventsInput
    connect?: UserSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutEventsInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserSessionUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<UserSessionCreateWithoutEventsInput, UserSessionUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutEventsInput
    upsert?: UserSessionUpsertWithoutEventsInput
    connect?: UserSessionWhereUniqueInput
    update?: XOR<XOR<UserSessionUpdateToOneWithWhereWithoutEventsInput, UserSessionUpdateWithoutEventsInput>, UserSessionUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateOneWithoutEventsNestedInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    upsert?: UserUpsertWithoutEventsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventsInput, UserUpdateWithoutEventsInput>, UserUncheckedUpdateWithoutEventsInput>
  }

  export type UserSessionCreateNestedOneWithoutPageViewsRelInput = {
    create?: XOR<UserSessionCreateWithoutPageViewsRelInput, UserSessionUncheckedCreateWithoutPageViewsRelInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutPageViewsRelInput
    connect?: UserSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPageViewsInput = {
    create?: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPageViewsInput
    connect?: UserWhereUniqueInput
  }

  export type UserSessionUpdateOneRequiredWithoutPageViewsRelNestedInput = {
    create?: XOR<UserSessionCreateWithoutPageViewsRelInput, UserSessionUncheckedCreateWithoutPageViewsRelInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutPageViewsRelInput
    upsert?: UserSessionUpsertWithoutPageViewsRelInput
    connect?: UserSessionWhereUniqueInput
    update?: XOR<XOR<UserSessionUpdateToOneWithWhereWithoutPageViewsRelInput, UserSessionUpdateWithoutPageViewsRelInput>, UserSessionUncheckedUpdateWithoutPageViewsRelInput>
  }

  export type UserUpdateOneWithoutPageViewsNestedInput = {
    create?: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPageViewsInput
    upsert?: UserUpsertWithoutPageViewsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPageViewsInput, UserUpdateWithoutPageViewsInput>, UserUncheckedUpdateWithoutPageViewsInput>
  }

  export type UserSessionCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<UserSessionCreateWithoutChatSessionsInput, UserSessionUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutChatSessionsInput
    connect?: UserSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutChatAnalyticsInput = {
    create?: XOR<UserCreateWithoutChatAnalyticsInput, UserUncheckedCreateWithoutChatAnalyticsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatAnalyticsInput
    connect?: UserWhereUniqueInput
  }

  export type UserSessionUpdateOneRequiredWithoutChatSessionsNestedInput = {
    create?: XOR<UserSessionCreateWithoutChatSessionsInput, UserSessionUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserSessionCreateOrConnectWithoutChatSessionsInput
    upsert?: UserSessionUpsertWithoutChatSessionsInput
    connect?: UserSessionWhereUniqueInput
    update?: XOR<XOR<UserSessionUpdateToOneWithWhereWithoutChatSessionsInput, UserSessionUpdateWithoutChatSessionsInput>, UserSessionUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserUpdateOneWithoutChatAnalyticsNestedInput = {
    create?: XOR<UserCreateWithoutChatAnalyticsInput, UserUncheckedCreateWithoutChatAnalyticsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatAnalyticsInput
    upsert?: UserUpsertWithoutChatAnalyticsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatAnalyticsInput, UserUpdateWithoutChatAnalyticsInput>, UserUncheckedUpdateWithoutChatAnalyticsInput>
  }

  export type ArticleCreatetagsInput = {
    set: string[]
  }

  export type ArticleCreatedefaultKeyInsightsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutCreatedArticlesInput = {
    create?: XOR<UserCreateWithoutCreatedArticlesInput, UserUncheckedCreateWithoutCreatedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedArticlesInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutEditedArticlesInput = {
    create?: XOR<UserCreateWithoutEditedArticlesInput, UserUncheckedCreateWithoutEditedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEditedArticlesInput
    connect?: UserWhereUniqueInput
  }

  export type PersonalizedOutputCreateNestedManyWithoutArticleInput = {
    create?: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput> | PersonalizedOutputCreateWithoutArticleInput[] | PersonalizedOutputUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutArticleInput | PersonalizedOutputCreateOrConnectWithoutArticleInput[]
    createMany?: PersonalizedOutputCreateManyArticleInputEnvelope
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
  }

  export type PersonalizedOutputUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput> | PersonalizedOutputCreateWithoutArticleInput[] | PersonalizedOutputUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutArticleInput | PersonalizedOutputCreateOrConnectWithoutArticleInput[]
    createMany?: PersonalizedOutputCreateManyArticleInputEnvelope
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
  }

  export type ArticleUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ArticleUpdatedefaultKeyInsightsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumArticleStatusFieldUpdateOperationsInput = {
    set?: $Enums.ArticleStatus
  }

  export type UserUpdateOneWithoutCreatedArticlesNestedInput = {
    create?: XOR<UserCreateWithoutCreatedArticlesInput, UserUncheckedCreateWithoutCreatedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedArticlesInput
    upsert?: UserUpsertWithoutCreatedArticlesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedArticlesInput, UserUpdateWithoutCreatedArticlesInput>, UserUncheckedUpdateWithoutCreatedArticlesInput>
  }

  export type UserUpdateOneWithoutEditedArticlesNestedInput = {
    create?: XOR<UserCreateWithoutEditedArticlesInput, UserUncheckedCreateWithoutEditedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEditedArticlesInput
    upsert?: UserUpsertWithoutEditedArticlesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEditedArticlesInput, UserUpdateWithoutEditedArticlesInput>, UserUncheckedUpdateWithoutEditedArticlesInput>
  }

  export type PersonalizedOutputUpdateManyWithoutArticleNestedInput = {
    create?: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput> | PersonalizedOutputCreateWithoutArticleInput[] | PersonalizedOutputUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutArticleInput | PersonalizedOutputCreateOrConnectWithoutArticleInput[]
    upsert?: PersonalizedOutputUpsertWithWhereUniqueWithoutArticleInput | PersonalizedOutputUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: PersonalizedOutputCreateManyArticleInputEnvelope
    set?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    disconnect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    delete?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    update?: PersonalizedOutputUpdateWithWhereUniqueWithoutArticleInput | PersonalizedOutputUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: PersonalizedOutputUpdateManyWithWhereWithoutArticleInput | PersonalizedOutputUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
  }

  export type PersonalizedOutputUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput> | PersonalizedOutputCreateWithoutArticleInput[] | PersonalizedOutputUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: PersonalizedOutputCreateOrConnectWithoutArticleInput | PersonalizedOutputCreateOrConnectWithoutArticleInput[]
    upsert?: PersonalizedOutputUpsertWithWhereUniqueWithoutArticleInput | PersonalizedOutputUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: PersonalizedOutputCreateManyArticleInputEnvelope
    set?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    disconnect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    delete?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    connect?: PersonalizedOutputWhereUniqueInput | PersonalizedOutputWhereUniqueInput[]
    update?: PersonalizedOutputUpdateWithWhereUniqueWithoutArticleInput | PersonalizedOutputUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: PersonalizedOutputUpdateManyWithWhereWithoutArticleInput | PersonalizedOutputUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
  }

  export type PersonalizedOutputCreatepersonalizedKeyInsightsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutPersonalizationsInput = {
    create?: XOR<UserCreateWithoutPersonalizationsInput, UserUncheckedCreateWithoutPersonalizationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPersonalizationsInput
    connect?: UserWhereUniqueInput
  }

  export type ArticleCreateNestedOneWithoutPersonalizationsInput = {
    create?: XOR<ArticleCreateWithoutPersonalizationsInput, ArticleUncheckedCreateWithoutPersonalizationsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutPersonalizationsInput
    connect?: ArticleWhereUniqueInput
  }

  export type PersonalizedOutputUpdatepersonalizedKeyInsightsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutPersonalizationsNestedInput = {
    create?: XOR<UserCreateWithoutPersonalizationsInput, UserUncheckedCreateWithoutPersonalizationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPersonalizationsInput
    upsert?: UserUpsertWithoutPersonalizationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPersonalizationsInput, UserUpdateWithoutPersonalizationsInput>, UserUncheckedUpdateWithoutPersonalizationsInput>
  }

  export type ArticleUpdateOneRequiredWithoutPersonalizationsNestedInput = {
    create?: XOR<ArticleCreateWithoutPersonalizationsInput, ArticleUncheckedCreateWithoutPersonalizationsInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutPersonalizationsInput
    upsert?: ArticleUpsertWithoutPersonalizationsInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutPersonalizationsInput, ArticleUpdateWithoutPersonalizationsInput>, ArticleUncheckedUpdateWithoutPersonalizationsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumPublishedStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PublishedStatus | EnumPublishedStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPublishedStatusFilter<$PrismaModel> | $Enums.PublishedStatus
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumPublishedStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PublishedStatus | EnumPublishedStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PublishedStatus[] | ListEnumPublishedStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPublishedStatusWithAggregatesFilter<$PrismaModel> | $Enums.PublishedStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPublishedStatusFilter<$PrismaModel>
    _max?: NestedEnumPublishedStatusFilter<$PrismaModel>
  }

  export type NestedEnumContentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | EnumContentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumContentTypeFilter<$PrismaModel> | $Enums.ContentType
  }

  export type NestedEnumDeviceFilter<$PrismaModel = never> = {
    equals?: $Enums.Device | EnumDeviceFieldRefInput<$PrismaModel>
    in?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceFilter<$PrismaModel> | $Enums.Device
  }

  export type NestedEnumContentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContentType | EnumContentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ContentType[] | ListEnumContentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumContentTypeWithAggregatesFilter<$PrismaModel> | $Enums.ContentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumContentTypeFilter<$PrismaModel>
    _max?: NestedEnumContentTypeFilter<$PrismaModel>
  }

  export type NestedEnumDeviceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Device | EnumDeviceFieldRefInput<$PrismaModel>
    in?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    notIn?: $Enums.Device[] | ListEnumDeviceFieldRefInput<$PrismaModel>
    not?: NestedEnumDeviceWithAggregatesFilter<$PrismaModel> | $Enums.Device
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceFilter<$PrismaModel>
    _max?: NestedEnumDeviceFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumArticleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArticleStatusFilter<$PrismaModel> | $Enums.ArticleStatus
  }

  export type NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ArticleStatus | EnumArticleStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ArticleStatus[] | ListEnumArticleStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumArticleStatusWithAggregatesFilter<$PrismaModel> | $Enums.ArticleStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumArticleStatusFilter<$PrismaModel>
    _max?: NestedEnumArticleStatusFilter<$PrismaModel>
  }

  export type LikeCreateWithoutUserInput = {
    id?: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
    post: PostCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateWithoutUserInput = {
    id?: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type LikeCreateOrConnectWithoutUserInput = {
    where: LikeWhereUniqueInput
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
  }

  export type LikeCreateManyUserInputEnvelope = {
    data: LikeCreateManyUserInput | LikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    events?: AnalyticsEventCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewUncheckedCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AnalyticsEventCreateWithoutUserInput = {
    id?: string
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
    session: UserSessionCreateNestedOneWithoutEventsInput
  }

  export type AnalyticsEventUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type AnalyticsEventCreateOrConnectWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    create: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput>
  }

  export type AnalyticsEventCreateManyUserInputEnvelope = {
    data: AnalyticsEventCreateManyUserInput | AnalyticsEventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PageViewCreateWithoutUserInput = {
    id?: string
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
    session: UserSessionCreateNestedOneWithoutPageViewsRelInput
  }

  export type PageViewUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type PageViewCreateOrConnectWithoutUserInput = {
    where: PageViewWhereUniqueInput
    create: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput>
  }

  export type PageViewCreateManyUserInputEnvelope = {
    data: PageViewCreateManyUserInput | PageViewCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatAnalyticsCreateWithoutUserInput = {
    id?: string
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
    session: UserSessionCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatAnalyticsUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ChatAnalyticsCreateOrConnectWithoutUserInput = {
    where: ChatAnalyticsWhereUniqueInput
    create: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput>
  }

  export type ChatAnalyticsCreateManyUserInputEnvelope = {
    data: ChatAnalyticsCreateManyUserInput | ChatAnalyticsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ArticleCreateWithoutCreatedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastEditedBy?: UserCreateNestedOneWithoutEditedArticlesInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutCreatedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastEditedByAdminId?: string | null
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutCreatedByInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput>
  }

  export type ArticleCreateManyCreatedByInputEnvelope = {
    data: ArticleCreateManyCreatedByInput | ArticleCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ArticleCreateWithoutLastEditedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedArticlesInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutLastEditedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByAdminId?: string | null
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutLastEditedByInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput>
  }

  export type ArticleCreateManyLastEditedByInputEnvelope = {
    data: ArticleCreateManyLastEditedByInput | ArticleCreateManyLastEditedByInput[]
    skipDuplicates?: boolean
  }

  export type PersonalizedOutputCreateWithoutUserInput = {
    id?: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
    article: ArticleCreateNestedOneWithoutPersonalizationsInput
  }

  export type PersonalizedOutputUncheckedCreateWithoutUserInput = {
    id?: string
    articleId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type PersonalizedOutputCreateOrConnectWithoutUserInput = {
    where: PersonalizedOutputWhereUniqueInput
    create: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput>
  }

  export type PersonalizedOutputCreateManyUserInputEnvelope = {
    data: PersonalizedOutputCreateManyUserInput | PersonalizedOutputCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LikeUpsertWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput
    update: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
  }

  export type LikeUpdateWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput
    data: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>
  }

  export type LikeUpdateManyWithWhereWithoutUserInput = {
    where: LikeScalarWhereInput
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutUserInput>
  }

  export type LikeScalarWhereInput = {
    AND?: LikeScalarWhereInput | LikeScalarWhereInput[]
    OR?: LikeScalarWhereInput[]
    NOT?: LikeScalarWhereInput | LikeScalarWhereInput[]
    id?: UuidFilter<"Like"> | string
    userId?: UuidFilter<"Like"> | string
    postId?: UuidFilter<"Like"> | string
    contentId?: StringFilter<"Like"> | string
    contentType?: EnumContentTypeFilter<"Like"> | $Enums.ContentType
    contentTitle?: StringFilter<"Like"> | string
    deviceType?: EnumDeviceFilter<"Like"> | $Enums.Device
    timestamp?: DateTimeFilter<"Like"> | Date | string
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: UuidFilter<"UserSession"> | string
    userId?: UuidNullableFilter<"UserSession"> | string | null
    sessionId?: UuidFilter<"UserSession"> | string
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    deviceType?: EnumDeviceFilter<"UserSession"> | $Enums.Device
    countryCode?: StringNullableFilter<"UserSession"> | string | null
    region?: StringNullableFilter<"UserSession"> | string | null
    city?: StringNullableFilter<"UserSession"> | string | null
    startedAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActiveAt?: DateTimeFilter<"UserSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"UserSession"> | Date | string | null
    pageViews?: IntFilter<"UserSession"> | number
    eventsCount?: IntFilter<"UserSession"> | number
  }

  export type AnalyticsEventUpsertWithWhereUniqueWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    update: XOR<AnalyticsEventUpdateWithoutUserInput, AnalyticsEventUncheckedUpdateWithoutUserInput>
    create: XOR<AnalyticsEventCreateWithoutUserInput, AnalyticsEventUncheckedCreateWithoutUserInput>
  }

  export type AnalyticsEventUpdateWithWhereUniqueWithoutUserInput = {
    where: AnalyticsEventWhereUniqueInput
    data: XOR<AnalyticsEventUpdateWithoutUserInput, AnalyticsEventUncheckedUpdateWithoutUserInput>
  }

  export type AnalyticsEventUpdateManyWithWhereWithoutUserInput = {
    where: AnalyticsEventScalarWhereInput
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyWithoutUserInput>
  }

  export type AnalyticsEventScalarWhereInput = {
    AND?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
    OR?: AnalyticsEventScalarWhereInput[]
    NOT?: AnalyticsEventScalarWhereInput | AnalyticsEventScalarWhereInput[]
    id?: UuidFilter<"AnalyticsEvent"> | string
    sessionId?: UuidFilter<"AnalyticsEvent"> | string
    userId?: UuidNullableFilter<"AnalyticsEvent"> | string | null
    eventType?: StringFilter<"AnalyticsEvent"> | string
    eventAction?: StringFilter<"AnalyticsEvent"> | string
    eventCategory?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventLabel?: StringNullableFilter<"AnalyticsEvent"> | string | null
    eventValue?: DecimalNullableFilter<"AnalyticsEvent"> | Decimal | DecimalJsLike | number | string | null
    pagePath?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementId?: StringNullableFilter<"AnalyticsEvent"> | string | null
    elementType?: StringNullableFilter<"AnalyticsEvent"> | string | null
    metadata?: JsonNullableFilter<"AnalyticsEvent">
    timestamp?: DateTimeFilter<"AnalyticsEvent"> | Date | string
  }

  export type PageViewUpsertWithWhereUniqueWithoutUserInput = {
    where: PageViewWhereUniqueInput
    update: XOR<PageViewUpdateWithoutUserInput, PageViewUncheckedUpdateWithoutUserInput>
    create: XOR<PageViewCreateWithoutUserInput, PageViewUncheckedCreateWithoutUserInput>
  }

  export type PageViewUpdateWithWhereUniqueWithoutUserInput = {
    where: PageViewWhereUniqueInput
    data: XOR<PageViewUpdateWithoutUserInput, PageViewUncheckedUpdateWithoutUserInput>
  }

  export type PageViewUpdateManyWithWhereWithoutUserInput = {
    where: PageViewScalarWhereInput
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyWithoutUserInput>
  }

  export type PageViewScalarWhereInput = {
    AND?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
    OR?: PageViewScalarWhereInput[]
    NOT?: PageViewScalarWhereInput | PageViewScalarWhereInput[]
    id?: UuidFilter<"PageView"> | string
    sessionId?: UuidFilter<"PageView"> | string
    userId?: UuidNullableFilter<"PageView"> | string | null
    pagePath?: StringFilter<"PageView"> | string
    pageTitle?: StringNullableFilter<"PageView"> | string | null
    referrer?: StringNullableFilter<"PageView"> | string | null
    timeOnPage?: IntNullableFilter<"PageView"> | number | null
    scrollDepth?: IntNullableFilter<"PageView"> | number | null
    exitPage?: BoolFilter<"PageView"> | boolean
    bounce?: BoolFilter<"PageView"> | boolean
    timestamp?: DateTimeFilter<"PageView"> | Date | string
  }

  export type ChatAnalyticsUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatAnalyticsWhereUniqueInput
    update: XOR<ChatAnalyticsUpdateWithoutUserInput, ChatAnalyticsUncheckedUpdateWithoutUserInput>
    create: XOR<ChatAnalyticsCreateWithoutUserInput, ChatAnalyticsUncheckedCreateWithoutUserInput>
  }

  export type ChatAnalyticsUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatAnalyticsWhereUniqueInput
    data: XOR<ChatAnalyticsUpdateWithoutUserInput, ChatAnalyticsUncheckedUpdateWithoutUserInput>
  }

  export type ChatAnalyticsUpdateManyWithWhereWithoutUserInput = {
    where: ChatAnalyticsScalarWhereInput
    data: XOR<ChatAnalyticsUpdateManyMutationInput, ChatAnalyticsUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatAnalyticsScalarWhereInput = {
    AND?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
    OR?: ChatAnalyticsScalarWhereInput[]
    NOT?: ChatAnalyticsScalarWhereInput | ChatAnalyticsScalarWhereInput[]
    id?: UuidFilter<"ChatAnalytics"> | string
    sessionId?: UuidFilter<"ChatAnalytics"> | string
    userId?: UuidNullableFilter<"ChatAnalytics"> | string | null
    conversationId?: StringFilter<"ChatAnalytics"> | string
    messageCount?: IntFilter<"ChatAnalytics"> | number
    sessionDuration?: IntNullableFilter<"ChatAnalytics"> | number | null
    selectedArticle?: StringNullableFilter<"ChatAnalytics"> | string | null
    selectedContentType?: StringNullableFilter<"ChatAnalytics"> | string | null
    tokensUsed?: IntNullableFilter<"ChatAnalytics"> | number | null
    errorCount?: IntFilter<"ChatAnalytics"> | number
    startedAt?: DateTimeFilter<"ChatAnalytics"> | Date | string
    endedAt?: DateTimeNullableFilter<"ChatAnalytics"> | Date | string | null
  }

  export type ArticleUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutCreatedByInput, ArticleUncheckedUpdateWithoutCreatedByInput>
    create: XOR<ArticleCreateWithoutCreatedByInput, ArticleUncheckedCreateWithoutCreatedByInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutCreatedByInput, ArticleUncheckedUpdateWithoutCreatedByInput>
  }

  export type ArticleUpdateManyWithWhereWithoutCreatedByInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type ArticleScalarWhereInput = {
    AND?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    OR?: ArticleScalarWhereInput[]
    NOT?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    id?: UuidFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    content?: StringNullableFilter<"Article"> | string | null
    contentType?: StringFilter<"Article"> | string
    articleTopic?: StringNullableFilter<"Article"> | string | null
    category?: StringNullableFilter<"Article"> | string | null
    tags?: StringNullableListFilter<"Article">
    defaultKeyInsights?: StringNullableListFilter<"Article">
    defaultVideoScript?: StringNullableFilter<"Article"> | string | null
    defaultEmailTemplate?: StringNullableFilter<"Article"> | string | null
    defaultSocialContent?: JsonNullableFilter<"Article">
    position?: IntFilter<"Article"> | number
    imageUrl?: StringNullableFilter<"Article"> | string | null
    sourceUrl?: StringNullableFilter<"Article"> | string | null
    metadata?: JsonNullableFilter<"Article">
    status?: EnumArticleStatusFilter<"Article"> | $Enums.ArticleStatus
    publishedAt?: DateTimeNullableFilter<"Article"> | Date | string | null
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    createdByAdminId?: UuidNullableFilter<"Article"> | string | null
    lastEditedByAdminId?: UuidNullableFilter<"Article"> | string | null
  }

  export type ArticleUpsertWithWhereUniqueWithoutLastEditedByInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutLastEditedByInput, ArticleUncheckedUpdateWithoutLastEditedByInput>
    create: XOR<ArticleCreateWithoutLastEditedByInput, ArticleUncheckedCreateWithoutLastEditedByInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutLastEditedByInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutLastEditedByInput, ArticleUncheckedUpdateWithoutLastEditedByInput>
  }

  export type ArticleUpdateManyWithWhereWithoutLastEditedByInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutLastEditedByInput>
  }

  export type PersonalizedOutputUpsertWithWhereUniqueWithoutUserInput = {
    where: PersonalizedOutputWhereUniqueInput
    update: XOR<PersonalizedOutputUpdateWithoutUserInput, PersonalizedOutputUncheckedUpdateWithoutUserInput>
    create: XOR<PersonalizedOutputCreateWithoutUserInput, PersonalizedOutputUncheckedCreateWithoutUserInput>
  }

  export type PersonalizedOutputUpdateWithWhereUniqueWithoutUserInput = {
    where: PersonalizedOutputWhereUniqueInput
    data: XOR<PersonalizedOutputUpdateWithoutUserInput, PersonalizedOutputUncheckedUpdateWithoutUserInput>
  }

  export type PersonalizedOutputUpdateManyWithWhereWithoutUserInput = {
    where: PersonalizedOutputScalarWhereInput
    data: XOR<PersonalizedOutputUpdateManyMutationInput, PersonalizedOutputUncheckedUpdateManyWithoutUserInput>
  }

  export type PersonalizedOutputScalarWhereInput = {
    AND?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
    OR?: PersonalizedOutputScalarWhereInput[]
    NOT?: PersonalizedOutputScalarWhereInput | PersonalizedOutputScalarWhereInput[]
    id?: UuidFilter<"PersonalizedOutput"> | string
    userId?: UuidFilter<"PersonalizedOutput"> | string
    articleId?: UuidFilter<"PersonalizedOutput"> | string
    personalizedKeyInsights?: StringNullableListFilter<"PersonalizedOutput">
    personalizedVideoScript?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedEmailTemplate?: StringNullableFilter<"PersonalizedOutput"> | string | null
    personalizedSocialContent?: JsonNullableFilter<"PersonalizedOutput">
    truetoneSettings?: JsonNullableFilter<"PersonalizedOutput">
    tokensUsed?: IntNullableFilter<"PersonalizedOutput"> | number | null
    generationCount?: IntFilter<"PersonalizedOutput"> | number
    lastGeneratedAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
    createdAt?: DateTimeFilter<"PersonalizedOutput"> | Date | string
  }

  export type LikeCreateWithoutPostInput = {
    id?: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
    user: UserCreateNestedOneWithoutLikesInput
  }

  export type LikeUncheckedCreateWithoutPostInput = {
    id?: string
    userId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type LikeCreateOrConnectWithoutPostInput = {
    where: LikeWhereUniqueInput
    create: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
  }

  export type LikeCreateManyPostInputEnvelope = {
    data: LikeCreateManyPostInput | LikeCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type LikeUpsertWithWhereUniqueWithoutPostInput = {
    where: LikeWhereUniqueInput
    update: XOR<LikeUpdateWithoutPostInput, LikeUncheckedUpdateWithoutPostInput>
    create: XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
  }

  export type LikeUpdateWithWhereUniqueWithoutPostInput = {
    where: LikeWhereUniqueInput
    data: XOR<LikeUpdateWithoutPostInput, LikeUncheckedUpdateWithoutPostInput>
  }

  export type LikeUpdateManyWithWhereWithoutPostInput = {
    where: LikeScalarWhereInput
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutPostInput>
  }

  export type UserCreateWithoutLikesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLikesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLikesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
  }

  export type PostCreateWithoutLikesInput = {
    id?: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    publishedStatus?: $Enums.PublishedStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUncheckedCreateWithoutLikesInput = {
    id?: string
    title: string
    content: JsonNullValueInput | InputJsonValue
    publishedStatus?: $Enums.PublishedStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostCreateOrConnectWithoutLikesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
  }

  export type UserUpsertWithoutLikesInput = {
    update: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLikesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>
  }

  export type UserUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PostUpsertWithoutLikesInput = {
    update: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
    create: XOR<PostCreateWithoutLikesInput, PostUncheckedCreateWithoutLikesInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutLikesInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutLikesInput, PostUncheckedUpdateWithoutLikesInput>
  }

  export type PostUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    publishedStatus?: EnumPublishedStatusFieldUpdateOperationsInput | $Enums.PublishedStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type AnalyticsEventCreateWithoutSessionInput = {
    id?: string
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
    user?: UserCreateNestedOneWithoutEventsInput
  }

  export type AnalyticsEventUncheckedCreateWithoutSessionInput = {
    id?: string
    userId?: string | null
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type AnalyticsEventCreateOrConnectWithoutSessionInput = {
    where: AnalyticsEventWhereUniqueInput
    create: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput>
  }

  export type AnalyticsEventCreateManySessionInputEnvelope = {
    data: AnalyticsEventCreateManySessionInput | AnalyticsEventCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type PageViewCreateWithoutSessionInput = {
    id?: string
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
    user?: UserCreateNestedOneWithoutPageViewsInput
  }

  export type PageViewUncheckedCreateWithoutSessionInput = {
    id?: string
    userId?: string | null
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type PageViewCreateOrConnectWithoutSessionInput = {
    where: PageViewWhereUniqueInput
    create: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput>
  }

  export type PageViewCreateManySessionInputEnvelope = {
    data: PageViewCreateManySessionInput | PageViewCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ChatAnalyticsCreateWithoutSessionInput = {
    id?: string
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
    user?: UserCreateNestedOneWithoutChatAnalyticsInput
  }

  export type ChatAnalyticsUncheckedCreateWithoutSessionInput = {
    id?: string
    userId?: string | null
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ChatAnalyticsCreateOrConnectWithoutSessionInput = {
    where: ChatAnalyticsWhereUniqueInput
    create: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput>
  }

  export type ChatAnalyticsCreateManySessionInputEnvelope = {
    data: ChatAnalyticsCreateManySessionInput | ChatAnalyticsCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AnalyticsEventUpsertWithWhereUniqueWithoutSessionInput = {
    where: AnalyticsEventWhereUniqueInput
    update: XOR<AnalyticsEventUpdateWithoutSessionInput, AnalyticsEventUncheckedUpdateWithoutSessionInput>
    create: XOR<AnalyticsEventCreateWithoutSessionInput, AnalyticsEventUncheckedCreateWithoutSessionInput>
  }

  export type AnalyticsEventUpdateWithWhereUniqueWithoutSessionInput = {
    where: AnalyticsEventWhereUniqueInput
    data: XOR<AnalyticsEventUpdateWithoutSessionInput, AnalyticsEventUncheckedUpdateWithoutSessionInput>
  }

  export type AnalyticsEventUpdateManyWithWhereWithoutSessionInput = {
    where: AnalyticsEventScalarWhereInput
    data: XOR<AnalyticsEventUpdateManyMutationInput, AnalyticsEventUncheckedUpdateManyWithoutSessionInput>
  }

  export type PageViewUpsertWithWhereUniqueWithoutSessionInput = {
    where: PageViewWhereUniqueInput
    update: XOR<PageViewUpdateWithoutSessionInput, PageViewUncheckedUpdateWithoutSessionInput>
    create: XOR<PageViewCreateWithoutSessionInput, PageViewUncheckedCreateWithoutSessionInput>
  }

  export type PageViewUpdateWithWhereUniqueWithoutSessionInput = {
    where: PageViewWhereUniqueInput
    data: XOR<PageViewUpdateWithoutSessionInput, PageViewUncheckedUpdateWithoutSessionInput>
  }

  export type PageViewUpdateManyWithWhereWithoutSessionInput = {
    where: PageViewScalarWhereInput
    data: XOR<PageViewUpdateManyMutationInput, PageViewUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatAnalyticsUpsertWithWhereUniqueWithoutSessionInput = {
    where: ChatAnalyticsWhereUniqueInput
    update: XOR<ChatAnalyticsUpdateWithoutSessionInput, ChatAnalyticsUncheckedUpdateWithoutSessionInput>
    create: XOR<ChatAnalyticsCreateWithoutSessionInput, ChatAnalyticsUncheckedCreateWithoutSessionInput>
  }

  export type ChatAnalyticsUpdateWithWhereUniqueWithoutSessionInput = {
    where: ChatAnalyticsWhereUniqueInput
    data: XOR<ChatAnalyticsUpdateWithoutSessionInput, ChatAnalyticsUncheckedUpdateWithoutSessionInput>
  }

  export type ChatAnalyticsUpdateManyWithWhereWithoutSessionInput = {
    where: ChatAnalyticsScalarWhereInput
    data: XOR<ChatAnalyticsUpdateManyMutationInput, ChatAnalyticsUncheckedUpdateManyWithoutSessionInput>
  }

  export type UserSessionCreateWithoutEventsInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    user?: UserCreateNestedOneWithoutSessionsInput
    pageViewsRel?: PageViewCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUncheckedCreateWithoutEventsInput = {
    id?: string
    userId?: string | null
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    pageViewsRel?: PageViewUncheckedCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UserSessionCreateOrConnectWithoutEventsInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutEventsInput, UserSessionUncheckedCreateWithoutEventsInput>
  }

  export type UserCreateWithoutEventsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEventsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
  }

  export type UserSessionUpsertWithoutEventsInput = {
    update: XOR<UserSessionUpdateWithoutEventsInput, UserSessionUncheckedUpdateWithoutEventsInput>
    create: XOR<UserSessionCreateWithoutEventsInput, UserSessionUncheckedCreateWithoutEventsInput>
    where?: UserSessionWhereInput
  }

  export type UserSessionUpdateToOneWithWhereWithoutEventsInput = {
    where?: UserSessionWhereInput
    data: XOR<UserSessionUpdateWithoutEventsInput, UserSessionUncheckedUpdateWithoutEventsInput>
  }

  export type UserSessionUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutSessionsNestedInput
    pageViewsRel?: PageViewUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    pageViewsRel?: PageViewUncheckedUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserUpsertWithoutEventsInput = {
    update: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserSessionCreateWithoutPageViewsRelInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    user?: UserCreateNestedOneWithoutSessionsInput
    events?: AnalyticsEventCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUncheckedCreateWithoutPageViewsRelInput = {
    id?: string
    userId?: string | null
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutSessionInput
    chatSessions?: ChatAnalyticsUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UserSessionCreateOrConnectWithoutPageViewsRelInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutPageViewsRelInput, UserSessionUncheckedCreateWithoutPageViewsRelInput>
  }

  export type UserCreateWithoutPageViewsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPageViewsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPageViewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
  }

  export type UserSessionUpsertWithoutPageViewsRelInput = {
    update: XOR<UserSessionUpdateWithoutPageViewsRelInput, UserSessionUncheckedUpdateWithoutPageViewsRelInput>
    create: XOR<UserSessionCreateWithoutPageViewsRelInput, UserSessionUncheckedCreateWithoutPageViewsRelInput>
    where?: UserSessionWhereInput
  }

  export type UserSessionUpdateToOneWithWhereWithoutPageViewsRelInput = {
    where?: UserSessionWhereInput
    data: XOR<UserSessionUpdateWithoutPageViewsRelInput, UserSessionUncheckedUpdateWithoutPageViewsRelInput>
  }

  export type UserSessionUpdateWithoutPageViewsRelInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutSessionsNestedInput
    events?: AnalyticsEventUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateWithoutPageViewsRelInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    events?: AnalyticsEventUncheckedUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserUpsertWithoutPageViewsInput = {
    update: XOR<UserUpdateWithoutPageViewsInput, UserUncheckedUpdateWithoutPageViewsInput>
    create: XOR<UserCreateWithoutPageViewsInput, UserUncheckedCreateWithoutPageViewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPageViewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPageViewsInput, UserUncheckedUpdateWithoutPageViewsInput>
  }

  export type UserUpdateWithoutPageViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPageViewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserSessionCreateWithoutChatSessionsInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    user?: UserCreateNestedOneWithoutSessionsInput
    events?: AnalyticsEventCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewCreateNestedManyWithoutSessionInput
  }

  export type UserSessionUncheckedCreateWithoutChatSessionsInput = {
    id?: string
    userId?: string | null
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutSessionInput
    pageViewsRel?: PageViewUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UserSessionCreateOrConnectWithoutChatSessionsInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutChatSessionsInput, UserSessionUncheckedCreateWithoutChatSessionsInput>
  }

  export type UserCreateWithoutChatAnalyticsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatAnalyticsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatAnalyticsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatAnalyticsInput, UserUncheckedCreateWithoutChatAnalyticsInput>
  }

  export type UserSessionUpsertWithoutChatSessionsInput = {
    update: XOR<UserSessionUpdateWithoutChatSessionsInput, UserSessionUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<UserSessionCreateWithoutChatSessionsInput, UserSessionUncheckedCreateWithoutChatSessionsInput>
    where?: UserSessionWhereInput
  }

  export type UserSessionUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: UserSessionWhereInput
    data: XOR<UserSessionUpdateWithoutChatSessionsInput, UserSessionUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserSessionUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneWithoutSessionsNestedInput
    events?: AnalyticsEventUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateWithoutChatSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    events?: AnalyticsEventUncheckedUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserUpsertWithoutChatAnalyticsInput = {
    update: XOR<UserUpdateWithoutChatAnalyticsInput, UserUncheckedUpdateWithoutChatAnalyticsInput>
    create: XOR<UserCreateWithoutChatAnalyticsInput, UserUncheckedCreateWithoutChatAnalyticsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatAnalyticsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatAnalyticsInput, UserUncheckedUpdateWithoutChatAnalyticsInput>
  }

  export type UserUpdateWithoutChatAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCreatedArticlesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedArticlesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedArticlesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedArticlesInput, UserUncheckedCreateWithoutCreatedArticlesInput>
  }

  export type UserCreateWithoutEditedArticlesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    personalizations?: PersonalizedOutputCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEditedArticlesInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    personalizations?: PersonalizedOutputUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEditedArticlesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEditedArticlesInput, UserUncheckedCreateWithoutEditedArticlesInput>
  }

  export type PersonalizedOutputCreateWithoutArticleInput = {
    id?: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPersonalizationsInput
  }

  export type PersonalizedOutputUncheckedCreateWithoutArticleInput = {
    id?: string
    userId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type PersonalizedOutputCreateOrConnectWithoutArticleInput = {
    where: PersonalizedOutputWhereUniqueInput
    create: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput>
  }

  export type PersonalizedOutputCreateManyArticleInputEnvelope = {
    data: PersonalizedOutputCreateManyArticleInput | PersonalizedOutputCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedArticlesInput = {
    update: XOR<UserUpdateWithoutCreatedArticlesInput, UserUncheckedUpdateWithoutCreatedArticlesInput>
    create: XOR<UserCreateWithoutCreatedArticlesInput, UserUncheckedCreateWithoutCreatedArticlesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedArticlesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedArticlesInput, UserUncheckedUpdateWithoutCreatedArticlesInput>
  }

  export type UserUpdateWithoutCreatedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutEditedArticlesInput = {
    update: XOR<UserUpdateWithoutEditedArticlesInput, UserUncheckedUpdateWithoutEditedArticlesInput>
    create: XOR<UserCreateWithoutEditedArticlesInput, UserUncheckedCreateWithoutEditedArticlesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEditedArticlesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEditedArticlesInput, UserUncheckedUpdateWithoutEditedArticlesInput>
  }

  export type UserUpdateWithoutEditedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEditedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PersonalizedOutputUpsertWithWhereUniqueWithoutArticleInput = {
    where: PersonalizedOutputWhereUniqueInput
    update: XOR<PersonalizedOutputUpdateWithoutArticleInput, PersonalizedOutputUncheckedUpdateWithoutArticleInput>
    create: XOR<PersonalizedOutputCreateWithoutArticleInput, PersonalizedOutputUncheckedCreateWithoutArticleInput>
  }

  export type PersonalizedOutputUpdateWithWhereUniqueWithoutArticleInput = {
    where: PersonalizedOutputWhereUniqueInput
    data: XOR<PersonalizedOutputUpdateWithoutArticleInput, PersonalizedOutputUncheckedUpdateWithoutArticleInput>
  }

  export type PersonalizedOutputUpdateManyWithWhereWithoutArticleInput = {
    where: PersonalizedOutputScalarWhereInput
    data: XOR<PersonalizedOutputUpdateManyMutationInput, PersonalizedOutputUncheckedUpdateManyWithoutArticleInput>
  }

  export type UserCreateWithoutPersonalizationsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeCreateNestedManyWithoutUserInput
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    events?: AnalyticsEventCreateNestedManyWithoutUserInput
    pageViews?: PageViewCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsCreateNestedManyWithoutUserInput
    createdArticles?: ArticleCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleCreateNestedManyWithoutLastEditedByInput
  }

  export type UserUncheckedCreateWithoutPersonalizationsInput = {
    id?: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
    company?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kindeId?: string | null
    categoryPreferences?: UserCreatecategoryPreferencesInput | string[]
    savedArticleIds?: UserCreatesavedArticleIdsInput | string[]
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCreatedAt?: Date | string | null
    monthlyGenerationLimit?: number
    monthlyGenerationsUsed?: number
    generationResetDate?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    stripePriceId?: string | null
    hasCompletedOnboarding?: boolean
    onboardingStep?: number | null
    onboardingCompletedAt?: Date | string | null
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    events?: AnalyticsEventUncheckedCreateNestedManyWithoutUserInput
    pageViews?: PageViewUncheckedCreateNestedManyWithoutUserInput
    chatAnalytics?: ChatAnalyticsUncheckedCreateNestedManyWithoutUserInput
    createdArticles?: ArticleUncheckedCreateNestedManyWithoutCreatedByInput
    editedArticles?: ArticleUncheckedCreateNestedManyWithoutLastEditedByInput
  }

  export type UserCreateOrConnectWithoutPersonalizationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPersonalizationsInput, UserUncheckedCreateWithoutPersonalizationsInput>
  }

  export type ArticleCreateWithoutPersonalizationsInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: UserCreateNestedOneWithoutCreatedArticlesInput
    lastEditedBy?: UserCreateNestedOneWithoutEditedArticlesInput
  }

  export type ArticleUncheckedCreateWithoutPersonalizationsInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByAdminId?: string | null
    lastEditedByAdminId?: string | null
  }

  export type ArticleCreateOrConnectWithoutPersonalizationsInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutPersonalizationsInput, ArticleUncheckedCreateWithoutPersonalizationsInput>
  }

  export type UserUpsertWithoutPersonalizationsInput = {
    update: XOR<UserUpdateWithoutPersonalizationsInput, UserUncheckedUpdateWithoutPersonalizationsInput>
    create: XOR<UserCreateWithoutPersonalizationsInput, UserUncheckedCreateWithoutPersonalizationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPersonalizationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPersonalizationsInput, UserUncheckedUpdateWithoutPersonalizationsInput>
  }

  export type UserUpdateWithoutPersonalizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUpdateManyWithoutLastEditedByNestedInput
  }

  export type UserUncheckedUpdateWithoutPersonalizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    company?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kindeId?: NullableStringFieldUpdateOperationsInput | string | null
    categoryPreferences?: UserUpdatecategoryPreferencesInput | string[]
    savedArticleIds?: UserUpdatesavedArticleIdsInput | string[]
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCreatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyGenerationLimit?: IntFieldUpdateOperationsInput | number
    monthlyGenerationsUsed?: IntFieldUpdateOperationsInput | number
    generationResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceId?: NullableStringFieldUpdateOperationsInput | string | null
    hasCompletedOnboarding?: BoolFieldUpdateOperationsInput | boolean
    onboardingStep?: NullableIntFieldUpdateOperationsInput | number | null
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    events?: AnalyticsEventUncheckedUpdateManyWithoutUserNestedInput
    pageViews?: PageViewUncheckedUpdateManyWithoutUserNestedInput
    chatAnalytics?: ChatAnalyticsUncheckedUpdateManyWithoutUserNestedInput
    createdArticles?: ArticleUncheckedUpdateManyWithoutCreatedByNestedInput
    editedArticles?: ArticleUncheckedUpdateManyWithoutLastEditedByNestedInput
  }

  export type ArticleUpsertWithoutPersonalizationsInput = {
    update: XOR<ArticleUpdateWithoutPersonalizationsInput, ArticleUncheckedUpdateWithoutPersonalizationsInput>
    create: XOR<ArticleCreateWithoutPersonalizationsInput, ArticleUncheckedCreateWithoutPersonalizationsInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutPersonalizationsInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutPersonalizationsInput, ArticleUncheckedUpdateWithoutPersonalizationsInput>
  }

  export type ArticleUpdateWithoutPersonalizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedArticlesNestedInput
    lastEditedBy?: UserUpdateOneWithoutEditedArticlesNestedInput
  }

  export type ArticleUncheckedUpdateWithoutPersonalizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    lastEditedByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LikeCreateManyUserInput = {
    id?: string
    postId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    sessionId: string
    ipAddress?: string | null
    userAgent?: string | null
    deviceType?: $Enums.Device
    countryCode?: string | null
    region?: string | null
    city?: string | null
    startedAt?: Date | string
    lastActiveAt?: Date | string
    endedAt?: Date | string | null
    pageViews?: number
    eventsCount?: number
  }

  export type AnalyticsEventCreateManyUserInput = {
    id?: string
    sessionId: string
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type PageViewCreateManyUserInput = {
    id?: string
    sessionId: string
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type ChatAnalyticsCreateManyUserInput = {
    id?: string
    sessionId: string
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ArticleCreateManyCreatedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastEditedByAdminId?: string | null
  }

  export type ArticleCreateManyLastEditedByInput = {
    id?: string
    title: string
    summary?: string | null
    content?: string | null
    contentType?: string
    articleTopic?: string | null
    category?: string | null
    tags?: ArticleCreatetagsInput | string[]
    defaultKeyInsights?: ArticleCreatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: string | null
    defaultEmailTemplate?: string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: number
    imageUrl?: string | null
    sourceUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: $Enums.ArticleStatus
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdByAdminId?: string | null
  }

  export type PersonalizedOutputCreateManyUserInput = {
    id?: string
    articleId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type LikeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    postId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    events?: AnalyticsEventUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
    events?: AnalyticsEventUncheckedUpdateManyWithoutSessionNestedInput
    pageViewsRel?: PageViewUncheckedUpdateManyWithoutSessionNestedInput
    chatSessions?: ChatAnalyticsUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActiveAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pageViews?: IntFieldUpdateOperationsInput | number
    eventsCount?: IntFieldUpdateOperationsInput | number
  }

  export type AnalyticsEventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UserSessionUpdateOneRequiredWithoutEventsNestedInput
  }

  export type AnalyticsEventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UserSessionUpdateOneRequiredWithoutPageViewsRelNestedInput
  }

  export type PageViewUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatAnalyticsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    session?: UserSessionUpdateOneRequiredWithoutChatSessionsNestedInput
  }

  export type ChatAnalyticsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatAnalyticsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ArticleUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEditedBy?: UserUpdateOneWithoutEditedArticlesNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEditedByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastEditedByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ArticleUpdateWithoutLastEditedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneWithoutCreatedArticlesNestedInput
    personalizations?: PersonalizedOutputUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutLastEditedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
    personalizations?: PersonalizedOutputUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateManyWithoutLastEditedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    contentType?: StringFieldUpdateOperationsInput | string
    articleTopic?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ArticleUpdatetagsInput | string[]
    defaultKeyInsights?: ArticleUpdatedefaultKeyInsightsInput | string[]
    defaultVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    defaultEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSocialContent?: NullableJsonNullValueInput | InputJsonValue
    position?: IntFieldUpdateOperationsInput | number
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumArticleStatusFieldUpdateOperationsInput | $Enums.ArticleStatus
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdByAdminId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PersonalizedOutputUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutPersonalizationsNestedInput
  }

  export type PersonalizedOutputUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonalizedOutputUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeCreateManyPostInput = {
    id?: string
    userId: string
    contentId: string
    contentType: $Enums.ContentType
    contentTitle: string
    deviceType?: $Enums.Device
    timestamp?: Date | string
  }

  export type LikeUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLikesNestedInput
  }

  export type LikeUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LikeUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    contentType?: EnumContentTypeFieldUpdateOperationsInput | $Enums.ContentType
    contentTitle?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceFieldUpdateOperationsInput | $Enums.Device
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventCreateManySessionInput = {
    id?: string
    userId?: string | null
    eventType: string
    eventAction: string
    eventCategory?: string | null
    eventLabel?: string | null
    eventValue?: Decimal | DecimalJsLike | number | string | null
    pagePath?: string | null
    elementId?: string | null
    elementType?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type PageViewCreateManySessionInput = {
    id?: string
    userId?: string | null
    pagePath: string
    pageTitle?: string | null
    referrer?: string | null
    timeOnPage?: number | null
    scrollDepth?: number | null
    exitPage?: boolean
    bounce?: boolean
    timestamp?: Date | string
  }

  export type ChatAnalyticsCreateManySessionInput = {
    id?: string
    userId?: string | null
    conversationId: string
    messageCount?: number
    sessionDuration?: number | null
    selectedArticle?: string | null
    selectedContentType?: string | null
    tokensUsed?: number | null
    errorCount?: number
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type AnalyticsEventUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEventsNestedInput
  }

  export type AnalyticsEventUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalyticsEventUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    eventAction?: StringFieldUpdateOperationsInput | string
    eventCategory?: NullableStringFieldUpdateOperationsInput | string | null
    eventLabel?: NullableStringFieldUpdateOperationsInput | string | null
    eventValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    pagePath?: NullableStringFieldUpdateOperationsInput | string | null
    elementId?: NullableStringFieldUpdateOperationsInput | string | null
    elementType?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutPageViewsNestedInput
  }

  export type PageViewUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageViewUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    pagePath?: StringFieldUpdateOperationsInput | string
    pageTitle?: NullableStringFieldUpdateOperationsInput | string | null
    referrer?: NullableStringFieldUpdateOperationsInput | string | null
    timeOnPage?: NullableIntFieldUpdateOperationsInput | number | null
    scrollDepth?: NullableIntFieldUpdateOperationsInput | number | null
    exitPage?: BoolFieldUpdateOperationsInput | boolean
    bounce?: BoolFieldUpdateOperationsInput | boolean
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatAnalyticsUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutChatAnalyticsNestedInput
  }

  export type ChatAnalyticsUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatAnalyticsUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: StringFieldUpdateOperationsInput | string
    messageCount?: IntFieldUpdateOperationsInput | number
    sessionDuration?: NullableIntFieldUpdateOperationsInput | number | null
    selectedArticle?: NullableStringFieldUpdateOperationsInput | string | null
    selectedContentType?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    errorCount?: IntFieldUpdateOperationsInput | number
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersonalizedOutputCreateManyArticleInput = {
    id?: string
    userId: string
    personalizedKeyInsights?: PersonalizedOutputCreatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: string | null
    personalizedEmailTemplate?: string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: number | null
    generationCount?: number
    lastGeneratedAt?: Date | string
    createdAt?: Date | string
  }

  export type PersonalizedOutputUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPersonalizationsNestedInput
  }

  export type PersonalizedOutputUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonalizedOutputUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalizedKeyInsights?: PersonalizedOutputUpdatepersonalizedKeyInsightsInput | string[]
    personalizedVideoScript?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedEmailTemplate?: NullableStringFieldUpdateOperationsInput | string | null
    personalizedSocialContent?: NullableJsonNullValueInput | InputJsonValue
    truetoneSettings?: NullableJsonNullValueInput | InputJsonValue
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generationCount?: IntFieldUpdateOperationsInput | number
    lastGeneratedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}