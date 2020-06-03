namespace my.checkinapi;

using cuid from '@sap/cds/common';

entity Users {
    key ID : Integer;
    name   : String;
    email  : String;
}

entity CheckIn {
    key ID : Integer;
    user   : Association to Users;
    office : Association to Offices;
    floor  : Association to Floors;
    date   : Date;
    active : Integer;
}

entity Offices {
    key ID : Integer;
    name   : String;
}

entity Floors {
    key ID   : Integer;
    name     : String;
    capacity : Integer;
    office   : Association to Offices;
}

entity SecurityGuards{
    key ID : Integer;
    name   : String;
    email  : String;
}

entity FloorSecurityGuards{
    key ID         : Integer;
    floor          : Association to Floors;
    securityGuard  : Association to SecurityGuards;
}