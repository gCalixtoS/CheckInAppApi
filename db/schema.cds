namespace my.checkinapi;

using cuid from '@sap/cds/common';

entity Users {
    key ID : String;
    name   : String;
    email  : String;
}

entity SysAdmins : cuid {
    name   : String;
    email  : String;
}

entity CheckIn : cuid{
    user   : Association to Users;
    office : Association to Offices;
    floor  : Association to Floors;
    date   : Date;
    active : Integer;
}

entity Offices : cuid{
    name   : String;
    localization: String;
    code : String;
    active : Integer
}

entity Floors : cuid{
    name     : String;
    capacity : Integer;
    active   : Integer;
    office   : Association to Offices;
}

entity SecurityGuards : cuid{
    name   : String;
    email  : String;
    active : Integer;
}

entity FloorSecurityGuards : cuid{
    floor          : Association to Floors;
    securityGuard  : Association to SecurityGuards;
};

VIEW Administrators as SELECT From FloorSecurityGuards {
    key ID : String,
    floor.ID as floorId,
    securityGuard.ID as securityGuardId,
    floor.capacity as capacity,
    floor.name as floorName,
    securityGuard.email as securityGuardEmail,
    securityGuard.name as securityGuardName,
};

VIEW FloorsList as SELECT FROM Floors{
    key ID : String,
    office.name as officeName,
    name as floorName,
    capacity,
    active
};

VIEW FloorSecurityGuardsView as SELECT FROM FloorSecurityGuards{
    key ID : String,
    securityGuard.name as securityGuardName,
    securityGuard.email as securityGuardEmail,
    floor.name as floor,
    floor.ID as floor_ID,
    floor.office.name as office
};

VIEW CheckInList as SELECT FROM CheckIn
{
    key ID : String,
    office.name as officeName,
    floor.name as floorName,
    date,
    active,
    user.ID as user
};

VIEW AvailableCapacity as SELECT FROM CheckIn
{
    key floor.ID,
    (floor.capacity - count(ID)) as AvailableCapacity : Integer,
    date
} GROUP BY floor.ID, date, floor.capacity;

VIEW OccupiedCapacity as SELECT FROM CheckIn
{
    key floor.ID,
    (office.name || '-' || floor.name) as officeFloor : String,
    count(ID) as OccupiedCapacity : Integer,
    date
} GROUP BY floor.ID, date, office.name, floor.name;

VIEW DailyCheckInList as SELECT FROM CheckIn
{
    key ID : String,
    office.name as officeName,
    floor.name as floorName,
    floor.ID as floorID,
    date,
    active,
    user.name as userName,
    user.email as userEmail
};
