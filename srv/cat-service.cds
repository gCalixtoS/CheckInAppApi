using my.checkinapi as my from '../db/schema';

service CatalogService {
  entity CheckIn as projection on my.CheckIn;
  entity Floors as projection on my.Floors;
  entity FloorSecurityGuards as projection on my.FloorSecurityGuards;
  entity Offices as projection on my.Offices;
  entity SecurityGuards as projection on my.SecurityGuards;
  entity Users as projection on my.Users;
  view CheckinAppList as select from my.View.CheckInList;
  view AvailableCapacity as select from my.View.AvailableCapacity;
  view OccupiedCapacity as select from my.View.OccupiedCapacity;
}