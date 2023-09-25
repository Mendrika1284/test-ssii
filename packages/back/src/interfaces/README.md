# How to use it

## Service moleculer

### **Custom types**

Ces types sont définit dans `src/@types/moleculer`, ils permettent de générer les types utilisable par les fichiers de service et mixin.

> ⚠️ il ne doivent pas être modifier sauf en cas d'erreur suite à une mise à jour des types du node_module moleculer

- Service `ServiceCustom`: Créé le type `Service` utilisé par **this**
- Context
  - `CallActionsContextCustom`: Permet de créé l'interface de typage des actions moleculer. Définie les _params_, _meta_, _response_ du **ctx.call** ainsi que le typage des schémas d'**actions** correspondant.
  - `EmitEventsContextCustom`: Permet de créé l'interface de typage des évènement moleculer. Définie les _params_, _meta_ du **ctx.emit** ainsi que le typage des schémas d'**events** correspondant.
  - `ContextCustom`: Permet de créé le typage du **ctx**. Implémente les interfaces `CallActionsContextCustom` et `EmitEventsContextCustom` (entre autres), pour ajouter l'autocomplétion des méthodes **ctx.call**, **ctx.emit** et **ctx.broadcast**
- Methods `ServiceMethodsCustom`: Permet de créé l'interface de typage des méthodes moleculer.
- Schemas
  - `ServiceSchemaCustom`: Permet de créé l'interface du schémas du service, _name_, _mixins_, _settings_, _created_, _started_, _actions_, _events_, _methods_, etc.
  - `ServiceSettingSchemaCustom`: Permet de créé l'interface du schémas du _settings_
  - `ServiceActionsSchemaCustom`: Permet de créé le type du schémas de _actions_
  - `ServiceEventsSchemaCustom`: Permet de créé le type du schémas de _events_

### **Implémentation du typage des services et mixins**

Un fichier de typage de service moleculer est composé de 3 parties:

- **Permanent**: C'est une section non modifiable, nécessaire pour générer les types du fichier de service.

Définitions:

- **interne**: désigne une utilisation seulement pour le service d'on il est destiné
- **externe**: désigne une utilisation pour le service d'on il est destiné, mais aussi être utilisé par des services/mixins/libs/etc autre que celui d'on il est destiné

#### **1. Permanent**

Les types renseignés ici sont fix et non modifiable. Il comprant:

- `ServiceName`: Le nom du service
  ```typescript
  type ServiceName = "service.name";
  ```
- `ServiceActionsSchema`: L'implémentation du type `ServiceActionsSchemaCustom`. Ce type particuler n'est pas modifiable. Définit les _actions_ du schéma de service. (interne)
  ```typescript
  type ServiceActionsSchema = ServiceActionsSchemaCustom<
    ServiceSettingSchema,
    ServiceName,
    INameService.Service,
    ServiceActionsNames,
    CallActionsNamesAvailable,
    CallActionsContextAvailable,
    ServiceEventsNames,
    EmitEventsNamesAvailable,
    EmitEventsContextAvailable
  >;
  ```
- `ServiceEventsSchema`: L'implémentation du type `ServiceEventsSchemaCustom`. Ce type particuler n'est pas modifiable. Définit les _events_ du schéma de service. (interne)
  ```typescript
  type ServiceEventsSchema = ServiceEventsSchemaCustom<
    ServiceSettingSchema,
    INameService.Service,
    CallActionsNamesAvailable,
    CallActionsContextAvailable,
    ServiceEventsNames,
    EmitEventsNamesAvailable,
    EmitEventsContextAvailable
  >;
  ```

#### **2. Config**

Les types renseigné ici sont interne au service. Il comprant :

- `ServiceSettingSchema`: L'implémentation du type `ServiceSettingSchemaCustom`. Définit les _settings_ du schéma de service. (interne)
  ```typescript
  // Default
  interface ServiceSettingSchema extends ServiceSettingSchemaCustom {}
  // Use
  interface ServiceSettingSchema extends ServiceSettingSchemaCustom {
    key: string;
  }
  ```
- `ServiceActionsNames`: Les noms des actions définit sous la clé _actions_ du schéma de service. (interne)
  ```typescript
  // Default
  type ServiceActionsNames = never;
  // Use
  type ServiceActionsNames = "action" | "action2";
  ```
- `CallActionsNamesAvailable`: Les noms des actions appelable par **ctx.call**. Ce type implémente le type `CallActionsNames` de son service et des autres services/mixins. (interne et externe)
  ```typescript
  // Default
  type CallActionsNamesAvailable = INameService.CallActionsNames;
  // Use
  type CallActionsNamesAvailable = INameService.CallActionsNames | INameService2.CallActionsNames;
  ```
- `CallActionsContextAvailable`: Les contexts des actions appelable par **ctx.call** et le typage sous la clé _actions_. Ce type implémente le type `CallActionsContext` de son service et des autres services/mixins. (interne et externe)
  ```typescript
  // Default
  type CallActionsContextAvailable = INameService.CallActionsContext;
  // Use
  type CallActionsContextAvailable = INameService.CallActionsContext & INameService2.CallActionsContext;
  ```
- `ServiceEventsNames`: Les noms des events définit sous la clé _events_ du schéma de service (interne). Ce type implémente le type `EmitEventsNames` des différents services/mixins (externe).
  ```typescript
  // Default
  type ServiceEventsNames = never;
  // Use
  type ServiceEventsNames = INameService.EmitEventsNames.EVENT_NAMED;
  type ServiceEventsNames = INameService.EmitEventsNames.EVENT_NAMED | INameService.EmitEventsNames.EVENT_NAMED2;
  type ServiceEventsNames = INameService.EmitEventsNames.EVENT_NAMED | INameService2.EmitEventsNames.EVENT_NAMED2;
  ```
- `EmitEventsNamesAvailable`: Les noms des events émettable par **ctx.emit**. Ce type particuler n'est pas modifiable, il est automatiquement construit en fonction de `EmitEventsNames`. (interne)
  ```typescript
  type EmitEventsNamesAvailable = `${INameService.EmitEventsNames}`;
  ```
- `EmitEventsContextAvailable`: Les contexts des events émettable par **ctx.emit** et le typage sous la clé _events_. Ce type implémente les types `EmitEventsContext` de son service et des autres services/mixins. (interne et externe)
  ```typescript
  // Default
  type EmitEventsContextAvailable = INameService.EmitEventsContext;
  // Use
  type EmitEventsContextAvailable = INameService.EmitEventsContext & INameService2.EmitEventsContext;
  ```
- `ServiceMethodsAvailable`: Les méthodes utilisable par le service. Ce type implémente les types `ServiceMethods` de son service et des autres services/mixins. (interne et externe)
  ```typescript
  // Default
  type ServiceMethodsAvailable = INameService.ServiceMethods;
  // Use
  // Seulement valable pour intéger les mixins
  type ServiceMethodsAvailable = INameService.ServiceMethods & INameService2.ServiceMethods;
  ```

#### **3. Export**

Les types renseigné ici sont à la fois interne au service et utilisable par les autres services (externe), librairies, etc (pour certain). Ces types permet d'être utilisé dans nos `.ts` et `.d.ts`. Il comprant :

- `ServiceSchema`: L'implémentation du type `ServiceSchemaCustom`. Définition du schéma du service. Cette interface particulière est utilisable seulement par son service (interne). Elle définie entiérement le schéma ainsi que le typage de _openapi_, _params_, _handler_ (**this**, **ctx** ), des _actions_ et _events_. (interne)
  ```typescript
  // Default
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    // mixins: [];
    // settings: ServiceSettingSchema;
    // created: (this: Service) => void;
    // started: (this: Service) => Promise<void>;
    // hooks: {
    //  before: { "*": async (this: Service, ctx: Context): Promise<void> };
    // };
    // actions: ServiceActionsSchema;
    // events: ServiceEventsSchema;
    // methods: ServiceMethods;
  };
  // Use
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [IPermissionsMixin.ServiceSchema];
    settings: ServiceSettingSchema;
    created: (this: Service) => void;
    started: (this: Service) => Promise<void>;
    hooks: {
      before: { "*": async (this: Service, ctx: Context): Promise<void> };
    };
    actions: ServiceActionsSchema;
    events: ServiceEventsSchema;
    methods: ServiceMethods;
  };
  export type ServiceSchema = ServiceSchemaCustom<ServiceSettingSchema> & {
    name: ServiceName;
    mixins: [IPermissionsMixin.ServiceSchema];
    settings: ServiceSettingSchema;
    created: (this: Service) => void;
    started: (this: Service) => Promise<void>;
    hooks: {
      before: { "*": IPermissionsMixin.ServiceMethods<Service>["validateCompany"] }; // Sera supprimer une fois avoir supprimer le `ctx` en paramètre des methodes `validate*`
    };
    actions: ServiceActionsSchema;
    events: ServiceEventsSchema;
    methods: ServiceMethods;
  };
  ```
- `Service`: L'implémentation du type `ServiceCustom`. Ce type particuler n'est pas modifiable. Définie le type du service **this**. (interne)
  ```typescript
  export type Service = ServiceCustom<ServiceSettingSchema, ServiceMethodsAvailable>;
  ```
- `Context`: L'implémentation du type `ContextCustom`. Ce type particuler n'est pas modifiable. Définie le type du context **ctx**. (interne)
  ```typescript
  export type Context<ThisName extends CallActionsNames | ServiceEventsNames> = ContextCustom<
    ThisName,
    CallActionsNamesAvailable,
    CallActionsContextAvailable,
    ServiceEventsNames,
    EmitEventsNamesAvailable,
    EmitEventsContextAvailable
  >;
  ```
- `CallActionsNames`: Définit les noms interne au service des actions appelable par **ctx.call**. Ce type particuler n'est pas modifiable, il est automatiquement construit en fonction de `ServiceName` et `ServiceActionsNames`. Il permet d'être utilisé par `CallActionsNamesAvailable` pour son service et pour les autres services/mixins. (interne et externe)
  ```typescript
  export type CallActionsNames = `${ServiceName}.${ServiceActionsNames}`;
  ```
- `CallActionsContext`: L'implémentation du type `CallActionsContextCustom`. Définit les contexts des actions interne au service appelable par **ctx.call** et le typage sous la clé _actions_ du service. Il permet d'être utilisé par `CallActionsContextAvailable` pour son service et pour les autres services/mixins. (interne et externe)
  ```typescript
  // Default
  export interface CallActionsContext extends CallActionsContextCustom {}
  // Use
  export interface CallActionsContext extends CallActionsContextCustom {
    "service.name.action": {
      params: NameService.ActionIn;
      meta: { user: MetaUser };
      response: NameService.ActionOut;
    };
  }
  ```
- `EmitEventsNames`: Définit les noms interne au service des events émettable par **ctx.emit**. Il permet d'être utilisé par `EmitEventsNamesAvailable` pour son service et pour les autres services/mixins. (interne et externe)
  ```typescript
  // Default
  export enum EmitEventsNames {}
  // Use
  export enum EmitEventsNames {
    EVENT_NAMED = "service.name.event-named",
  }
  ```
- `EmitEventsContext`: L'implémentation du type `EmitEventsContextCustom`. Définit les contexts des events interne au service émettable par **ctx.emit** et le typage sous la clé _events_ du service. Il permet d'être utilisé par `EmitEventsContextAvailable` pour son service et pour les autres services/mixins. (interne et externe)
  ```typescript
  // Default
  export interface EmitEventsContext extends EmitEventsContextCustom {}
  // Use
  export interface EmitEventsContext extends EmitEventsContextCustom {
    [EmitEventsNames.EVENT_NAMED]: {
      params: { params: NameName; name: Name };
      meta: { user: MetaUser };
    };
  }
  ```
- `ServiceMethods`: L'implémentation du type `ServiceMethodsCustom`. Définit les méthodes utilisé par le service. Il permet d'être utilisé par `ServiceMethodsAvailable` pour son service Dans le cas d'une mixin, il est utilisé par `ServiceMethodsAvailable` des service qui implémente la mixin. (interne et externe)
  ```typescript
  // Default
  export interface ServiceMethods extends ServiceMethodsCustom {}
  // Use (service)
  export interface ServiceMethods extends ServiceMethodsCustom {
    methodName: (this: Service, ctx: Context<"service.name.action">, params: { key: string }) => Promise<Name>;
  }
  export interface ServiceMethods extends ServiceMethodsCustom {
    methodName: (
      this: Service,
      ctx: Context<"service.name.action" | "service.name.action2">,
      params: { key: string }
    ) => Promise<Name>;
  }
  export interface ServiceMethods extends ServiceMethodsCustom {
    methodName: (this: Service, params: { key: string }) => Promise<Name>;
  }
  // Use (mixin)
  export interface ServiceMethods<ServiceParent extends ServiceCustom = ServiceCustom> extends ServiceMethodsCustom {
    methodName: (this: Service & ServiceParent, params: { key: string }) => Promise<Name>;
  }
  ```
