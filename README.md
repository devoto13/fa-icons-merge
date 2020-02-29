# Experiment to provide better typings for FA

The relevant issues are [125](https://github.com/FortAwesome/angular-fontawesome/issues/125) and [172](https://github.com/FortAwesome/angular-fontawesome/issues/172).

1. First commit contains older installation of FA (as in 125): fontawesome-svg-core and free-regular-svg-icons. `index.ts` does not report any errors.
2. Second commit updates free-regular-svg-icons, but does not update fontawesome-svg-core. As a result project has two instances of fontawesome-common-types, which are incompatible with each other because `IconName` type used by `free-regular-svg-icons` more values than `IconName` type used by `fontawesome-svg-core`. Now there is an error in `index.ts`:

   ```
   index.ts:4:13 - error TS2345: Argument of type 'IconPack' is not assignable to parameter of type 'IconDefinitionOrPack'.
     Type 'IconPack' is missing the following properties from type 'IconDefinition': icon, prefix, iconName
   ```

3. Third commit implements first part of the changes: eliminate dependency on fontawesome-common-types from icon packages. It kinda does not make sense to have a type with all possible icon names from all packages and then type a specific icon with it. It is pretty trivial to just inline type definitions with the specific types. Less dependencies, simpler to use, icon packages are self-contained.

   This change essentially ensures that in a regular setup only fontawesome-svg-core would depend on fontawesome-common-types and this will ensure that there is only one instance of the latter in the dependency tree. Note that it does not solve the 125 yet, because it is still possible to have old fontawesome-common-types installed and it will not allow to register newly added icons (this is addressed by the forth commit), but it is an improvement as now error only happens when one adds a new icon to the library (as opposed to when one just has multiple instances of fontawesome-common-types).

   On top of the main change this commit also does some breaking cleanup on the icon package. This is optional, but is nice to have and makes sense for changes presented in this repo:

   - `IconDefinition, IconLookup, IconName, IconPrefix, IconPack` is no longer re-exported from icon package, import from `fontawesome-common-types` directly instead
   - `far` is no longer exported, use `import * as far from '@fortawesome/free-regular-svg-icons'` instead
   - `prefix` is no longer exported (is it actually needed?), can be accessed using `import { faUser } '@fortawesome/free-regular-svg-icons'` + `faUser.prefix` if necessary

   Why not just set fontawesome-common-types as a peer dependency? Well, this will solve 125, but it is even more dependencies for user to install and update. I would really want to avoid that. As a side note, since `angular-fontawesome` now manages icon library itself instead of using one from `fontawesome-svg-core`, I plan to move `fontawesome-svg-core` into regular dependencies, so users only need to deal with one package + any icon packages they want.

4. Forth commit actually solves both 125 (ensures that any imported icons can be used) and 172 (custom icons can be used without `as any` cast). On top of this it provides another nice feature: only icons imported into the TypeScript compilation will show up in the completion list, not all possible icons from all packages.

   The approach relies on TypeScript's [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). And essentially works like a [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) (but without changing runtime, only types). Basically when user imports some icons, the `IconName` and `IconPrefix` types are extended with name and prefix of the imported icon(s). This is a nice feature as it allows to extend `IconName` and `IconPrefix` types with names of custom icons and use them without extra casts on the consumer side.

   The augmentation syntax is currently pretty rough. Unfortunately TS does not support [merging for string unions](https://github.com/Microsoft/TypeScript/issues/20366) and enums [will error](https://www.typescriptlang.org/play/index.html#code/CYUwxgNghgTiAEBbA9sArhBByRBPAtCuplvAN4BQ818IAdmovAJJjJ0ByUiClN-8AJZs6ARgA0QkQCYqNAL4VFFUJFgIiGbHkKotpPjXqMWIrj3JyBU9hJt0AzFfiL5QA) if same value is declared in two places. Probably the syntax of the augmentation can be improved, but for now I'm mostly interested in some initial feedback and discussion to see if it is worths more detailed investigation.

---

In this repository I've only updated icon package's bundle, but it should be trivial to update individual icons in a similar manner.
