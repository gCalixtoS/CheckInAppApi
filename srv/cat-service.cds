using my.checkinapi as my from '../db/schema';

service CatalogService {
  entity CheckIn as projection on my.CheckIn;
  @readonly entity Users as projection on my.Users;
  @readonly view CheckinAppList as select from my.CheckInList;
  @readonly view AvailableCapacity as select from my.AvailableCapacity;
  @readonly view ActiveOffices as select from my.Offices where active = 1;
  @readonly view ActiveFloors as select from my.Floors where active = 1;
}
