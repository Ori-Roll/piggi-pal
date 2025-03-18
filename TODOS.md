### Todo next:

1. Clean ui
   - add headers to sections (and space)
   - reintroduce piggi image
   - loader at the begginning - center
   - account dropdown looks bad
     Mobile issues:
   - close navbar on every action
2. Add basic validations to forms (task amount!)
3. fix "component is changing an uncontrolled input to be controlled" (periodic changes and maybe account?)

### Issues

- parent lock sometimes acts as create instead of existing lock
  (maybe happens when using immediately on app load)

## Todos after deploy is somewhat ready

1. Add Tasks delete ? and edit ?
2. Add login with credentials
3. Better performance - this can be checked in devtools performance tab
4. Add validators to requests in all routes (using zod)
5. remove all logs
6. add account options with:
   - choose sign ($/star) and other options
   - choose child user icon
7. Add Investments

# later

- set a build test (to make sure it doesn't fail) before merging to main
- improve types throughout including creating more types in dataTypes.ts
- Set up a local db mock using docker?

# maybe later

- improve headers?

# DOME

V nothing here appears on loading
V loader for v's in tasks
V make submits on forms work better (close and then loader in data)
v add logout
v added task amount functionality
v cron works!
v Add Transactions to current (on parent)
