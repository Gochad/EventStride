# EventStride

EventStride is an application designed to manage registrations of runners for races efficiently. It provides organizers with tools to handle participant data, race details, and payment processing seamlessly.

# Stack
1. Flask
2. MySQL
3. React with MUI

# Run
1. `docker-compose up --build`

# Design patterns
EventStride leverages several design patterns to create a scalable, maintainable, and user-friendly application. Below is a summary of the patterns currently implemented in the project:

## 1. Model-View-Controller (MVC)
- **Model:** Handles business logic and database interactions using Flask and SQLAlchemy.
- **View:** The React-based frontend manages the presentation layer, allowing users to interact with the application.
- **Controller:** Flask handles user requests, processes logic, and bridges the model and view layers.

## 2. Active Record
SQLAlchemy, an Object-Relational Mapping (ORM) library, is used to implement the Active Record pattern:
- Each database table is mapped to a Python class.
- Instances of these classes represent rows in the table.

## 3. Unit of Work
- To manage nested addition - `server/service/unitofwork.py`

## 4. Data Mapper
- To decouple model data from return data in api - `server/domain`

## 5. Server Session State
in-app session storage (flask-session)

### How it works

```mermaid
classDiagram
    class Runner {
        +int id
        +string name
        +int age
        +string category
        +registerForRace(RaceEvent event)
    }

    class RaceEvent {
        +int id
        +string name
        +Date date
        +Location location
        +int distance
        +List~Runner~ runners
        +Track track
        +Result results
        +addRunner(Runner runner)
        +getResults()
    }

    class Track {
        +int id
        +string name
        +int distance
        +string difficultyLevel
    }

    class Sponsor {
        +int id
        +string name
        +string logo
        +SponsorType type
        +provideSponsorship(RaceEvent event)
    }

    class Result {
        +int id
        +int position
        +Time finishTime
        +Runner runner
        +RaceEvent raceEvent
        +calculateFinalPosition()
    }

    class NotificationGateway {
        +sendEmailNotification(string message, Runner runner)
        +sendSMSNotification(string message, Runner runner)
    }

    class RaceService {
        +registerRunner(Runner runner, RaceEvent event)
        +manageEvent(RaceEvent event)
        +trackResults(RaceEvent event)
        +notifyRunners()
    }

    class Location {
        +string city
        +string country
    }

    Runner --> Result : achieved
    Runner "1" -- "*" RaceEvent : registers for
    RaceEvent "1" -- "*" Runner : has
    RaceEvent "1" -- "1" Track : uses
    RaceEvent "1" -- "*" Result : generates
    RaceEvent "1" -- "*" Sponsor : supported by
    Sponsor "1" -- "*" RaceEvent : sponsors
    Result "1" -- "1" Runner : involves
    Result "1" -- "1" RaceEvent : belongs to
    RaceService "1" -- "*" RaceEvent : manages
    NotificationGateway --> Runner : notifies
    NotificationGateway --> RaceEvent : monitors
```