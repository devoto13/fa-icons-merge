# Experiment to provide better typings for FA

The relevant issues are [125](https://github.com/FortAwesome/angular-fontawesome/issues/125) and [172](https://github.com/FortAwesome/angular-fontawesome/issues/172).

1. First commit contains older installation of FA (as in 125): fontawesome-svg-core and free-regular-svg-icons. `index.ts` does not report any errors.
2. Second commit updates free-regular-svg-icons, but does not update fontawesome-svg-core. As a result project has two instances of fontawesome-common-types, which are incompatible with each other because `IconName` type used by `free-regular-svg-icons` more values than `IconName` type used by `fontawesome-svg-core`. Now there is an error in `index.ts`:

   ```
   index.ts:4:13 - error TS2345: Argument of type 'IconPack' is not assignable to parameter of type 'IconDefinitionOrPack'.
     Type 'IconPack' is missing the following properties from type 'IconDefinition': icon, prefix, iconName
   ```
