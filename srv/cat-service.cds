using my.checkinapi as my from '../db/schema';

service CatalogService {
  entity CheckIn as projection on my.CheckIn;
  entity Floors as projection on my.Floors;
  entity FloorSecurityGuards as projection on my.FloorSecurityGuards;
  entity Offices as projection on my.Offices;
  entity SecurityGuards as projection on my.SecurityGuards;
  entity Users as projection on my.Users;
  view CheckinAppList as select from my.CheckInList;
  view AvailableCapacity as select from my.AvailableCapacity;
  view OccupiedCapacity as select from my.OccupiedCapacity;
  view FloorSecurityGuardsView as select from my.FloorSecurityGuardsView;
  view ActiveOffices as select from my.Offices where active = 1;
  view ActiveFloors as select from my.Floors where active = 1;
  view FloorsList as select from my.FloorsList;
  view Administrators as select from my.Administrators
}