import Realm from 'realm';

var realmdb = null;

const Events = {
  name: 'Events',
  primaryKey: '_id',
  properties: {
    audience: 'string',
    available_seats: 'string',
    category: 'string',
    college: 'string',
    channel : 'string',
    channel_name : 'string',
    enrolled : 'string',
    contact_details: 'string',
    date: 'date',
    description: 'string',
    email: 'string',
    enrollees: 'string',
    ms : 'int',
    faq: 'string',
    location: 'string',
    media: 'string',
    name: 'string',
    price: 'string',
    reach: 'string',
    reg_end: 'date',
    reg_start: 'date',
    tags: 'string',
    timestamp: 'date',
    title: 'string',
    views: 'string',
    _id:  'string'
  }
};

const Activity = {
  name: 'Activity',
  primaryKey: '_id',
  properties: {
    audience: 'string',
    channel: 'string',
    email: 'string',
    message: 'string',
    name: 'string',
    options: 'string',
    reach: 'string',
    media: 'string',
    timestamp: 'date',
    type: 'string',
    poll_type : 'string',
    answered: 'string',
    views: 'string',
    _id:  'string'
  }
};

const Channel = {
  name: 'Channel',
  primaryKey: '_id',
  properties: {
    name: 'string',
    description: 'string',
    category: 'string',
    followers: 'string',
    creator: 'string',
    media: 'string',
    _id: 'string',
    followed : 'string',
    priority : 'int',
    timestamp: {type: 'date', optional: true}
  }
};

export default {
  getRealm: (callback) => { 
    if(realmdb === null) {
      return Realm.open({schema: [Events, Activity, Channel], deleteRealmIfMigrationNeeded: true })
        .then(realm => {
          realmdb = realm;
          callback(realmdb);
        });
    } else {
      callback(realmdb);
    }
  }
};

/* 
  TERMS OF USAGE
  * PLEASE DON'T ADD ANY FIELD TO SCHEMA AS IT WILL LEAD TO MIGRATION AND APP WILL DELETE THE SCHEMA.
  * IF ADDING FILED IS REQUIRED ON OTA, PLEASE LOGOUT THE USER AND DELETE THE SCEHMA THEN.
*/
