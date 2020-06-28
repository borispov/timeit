# General Idea

Allow employees to fill in daily working hours that they have worked with each of their patients.

The coordinator/manager will then be able to access his employee's workable hours

There are couple of options to achieve this, the vary by __complexity__:
<sub>Begins from least complex</sub>
1. Google Forms with pre-filled Dates for the month
2. Send time-data as spreadsheets (csv?!) via Email
3. SPA with dashboard for the manager.

The first two are almost self explanatory.

The 2nd option involves building an app as well, however, it does not require intensive work as all that is required is to send an email.
However, it will not be possible to let other workers use this as well.

The third option involves building a full blown full stack application that includes a database, an authentication system, dashboard panel. Each employee that registers has to be related to specific coordinator. Sounds like good use case for using SQL Database, however, the whole implementation would require a lot of resources (***TIME!***).

## The Second Option

I am leaning towards this solution, couple of reasons: 

- It is much more simpler and faster than 3rd option. Yet, not too much more complex than the first option.
- It will be easier for employees who are not necessarily Tech-Friendly to use this app. The first option lacks only because there is no friendly way to actually fill in HOURS in a table-view-way.


## A Look Into Possible Implementations:

#### Homepage:
- Employee Name            _Input_
- Employee's Patient Name  _Input_
- Timetable with dates for current month ( Available Until 10th Of Each Month )
- Each date has the columns: _from time, till time, notes_.
- Employee can fill the times (Hours) he met with his patients
- Employee can SUBMIT the form, and then forwarded to PREVIEW _Modal_ to CONFIRM.

##### Notes: 
- Employee cannot edit the form after it's sent.  
- Employee cannot track or view sent forms.


## Thoughts
Can I send form submissions dynamically dependently on routing?
Say, the website is nathan-time.com.
Let's say we send the link nathan-time.com/ashkelon to employee.
He fills the forms and submits. The form is sent to an email that matches "ashkelon".
<br>
In order to achieve this, I need: Email To Use As The *CENTER*
Maybe my company will devote an email address just for this.

What if BUGS occur?
Meh...

