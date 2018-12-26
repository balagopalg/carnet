## Carnet Transaction Processor 

# Brief Description about TP

1.	There are two different JavaScript files are included in process folder.

2.	index.js: The firstone is index.js file which is used to:

    Adding handler, 
    The registration of the Transaction Processor,
    Registering the transaction processor to a particular validator is done here and the Transaction Processor is started.

3. CarNetHandler.js: carnetHandler operations are done in this file with 
 Respect to written importing variables 

4. Define the hashing functions, the family name, prefix, addressing schemes, encoding and decoding functions.

5. After this all process, make Functions for creating a Register, claim the policy, and view the details for customer using registered car number.

6. After this the handler for encoded payloads and the apply function is defined. And correspond payload call the Action


# Workflow


1. Workflow in between client and customer 

2. The client is policy/insurance Officer and customer is the person interested to by a registered used car

3. client defined a payload subject to an action and payload will be sent to the validator via the REST-API, which validator passes on to the    Transaction Processor

4. The Transaction Processor upon receiving the payload checks whether it is in correct or not.

5. If its correct then the validater will extract the action from the payload and calls the appropriate function  with the necessary variables.

6.Programm will be executed.


## Client


# Brief Description

1. carnetClient.js and index.js are two JavaScript file used to defined client process 

2.index.js:  index.js is a express file used to route into frontend 

3. carnetClient.js: In this we have defined set and get state operations and creating public and private key pairs for users and the Action functions used to defined those are register, claim and details 


#  Workflow


1.	Insurance officer can access our website using login (username and password is “carnet”)
2.	After he/she can enter the home page which can used to register a new car using vehicle No policy No and Validity details
3.	A new car will register in blockchain using describe details. We can include any number of vehicle insurance details using this function. And each of one have separate userdefindkey function
4.	The main process of insurance company is to claim the vehicle insurance
5.	Claim scheme contains option to add certain amount, for insurance purpose. And insurance officer can use this function to add claim details.
6.	Insurance companies are connect to many other authorities such as law and order, RTO, hospital. The details function help to access the claim details for their upcoming process 
