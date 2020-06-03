using my.checkinapi as my from '../db/schema';

service CatalogService {
  entity CheckIn @readonly as projection on my.CheckIn;
  entity Floors @readonly as projection on my.Floors;
  entity FloorSecurityGuards @insertonly as projection on my.FloorSecurityGuards;
  entity Offices @insertonly as projection on my.Offices;
  entity SecurityGuards @insertonly as projection on my.SecurityGuards;
  entity Users @insertonly as projection on my.Users;
}