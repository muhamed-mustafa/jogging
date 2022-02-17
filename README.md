# jogging

<h2>Local Dev</h2>

Set up ingress-nginx controller

* This is required for both local dev K8s cluster

Check ingress-nginx documentation : https://kubernetes.github.io/ingress-nginx/

## 

<h3>Create secret tokens in k8s cluster</h3>

* This is required for both local dev k8s

```
  e.g. To create a jwt key in k8s cluster that is used for jogging service:

  kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

  And inside jogging service k8s deployment config file (jogging-depl.yaml):

  - name: JWT_KEY
    valueFrom:
      secretKeyRef:
        name: jwt-secret
        key: JWT_KEY
  ```
<h3>Set up mock host name (local dev)</h3>

  * To redirect requests coming to : jogging.dev => localhost

  * only for local development purposes

  * MacOS/Linux :
  
     modify ```/etc/hosts``` file to include ```127.0.0.1 jogging.dev```

  * Windows :
  
     modify ```C:\Windows\System32\Drivers\etc\hosts``` file to include ```127.0.0.1 jogging.dev```

  * To skip the unskippable HTTPS warning in Chrome :
    try type thisisunsafe
   
##
 
<h3>Skaffold (local dev)</h3>

Install Skaffold Dev Tool : ```brew install skaffold```

From root project directory : ```run skaffold dev```

##

<h1>Common NPM Module</h1>

All the commonly used classes, interfaces and middlewares, etc. are extracted into a published NPM Module.

  * ```@micro-services1/common``` : https://www.npmjs.com/settings/micro-services1/packages
  
    Contains commonly used Middlewares and Error Classes for jogging service
    
##

<h1>Backend API</h1>

<h1>auth service</h1>

  * POST /api/auth/signup
  
    { "email" : "muuhamed14mustafa@gmail.com" , "password" : "mohamed14" , "gender" : "male" , "username" : "MoMustafa"}
  
    ```User sign up```
    
  * POST /api/auth/signin
  
    { "email" : "muuhamed14mustafa@gmail.com" , "password" : "mohamed14"}
  
    ```User sign in```
    
  * POST /api/auth/signout
  
    {}
  
    ```User sign out```
    
  * GET /api/auth
  
      ```Show user by query id```
  
  * PATCH /api/auth/user
  
      ```Update user info```
      
  * GET /api/auth/role
      
      ```Show all users by role```
      
  * DELETE /api/auth/role
  
      ```Delete users by role```
      
<h1>Task service</h1>

   * POST /api/task
  
      { "distance" : 500 , "time" : 200}

      ```Create new task```
      
   * PATCH /api/task
  
      { "distance" : 200 , "time" : 200}

      ```Update a task by email,id query```
      
   * GET /api/task

      ```Show all tasks```
      
   * DELETE /api/task

      ```Delete a task by query id```
      
 <h1>Run service</h1>

   * POST /api/run
  
      { "distance" : 100 , "time" : 30}

      ```Create new run```
      
   * PATCH /api/run
  
      { "distance" : 300 , "time" : 200}

      ```Update a run```
      
   * GET /api/run

      ```Show run by query id```
      
   * DELETE /api/run

      ```Delete a run by query id```
      
   * GET /api/run/filter
    
      ```Filter data by from,to query```
      
 <h1> Report service </h1>
 
   * GET /api/report/role
   
      ```Report on data by email query by role```
      
   * GET /api/report
   
      ```Report on data for current user```
      
 <h1> API documentation </h1>
    https://documenter.getpostman.com/view/19649073/UVkiTyV2
