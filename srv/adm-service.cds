using my.checkinapi as my from '../db/schema';


service AdminService {
  view Administrators as select from my.Administrators;
  entity Offices as projection on my.Offices;
  entity Floors as projection on my.Floors;
  entity FloorSecurityGuards as projection on my.FloorSecurityGuards;
  entity SecurityGuards as projection on my.SecurityGuards;
  view OccupiedCapacity as select from my.OccupiedCapacity;
  view FloorSecurityGuardsView as select from my.FloorSecurityGuardsView;
  view FloorsList as select from my.FloorsList;
  @readonly view DailyCheckInList as select from my.DailyCheckInList
}