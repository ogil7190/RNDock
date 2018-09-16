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
    enrolled : 'string',
    contact_details: 'string',
    date: 'date',
    description: 'string',
    email: 'string',
    enrollees: 'string',
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
    _id:  'string',
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
    timestamp: 'date',
    type: 'string',
    answered: 'string',
    views: 'string',
    _id:  'string',
  }
};

const Channels = {
  name: 'Channels',
  primaryKey: '_id',
  properties: {
    description: 'string',
    name: 'string',
    subscribed : 'string',
    subscribers: 'string',
    _id:  'string',
  }
};

export default {
  getRealm: (callback) => { 
    if(realmdb === null) {
      return Realm.open({schema: [Events, Activity, Channels], deleteRealmIfMigrationNeeded: true })
        .then(realm => {
          realmdb = realm;
          callback(realmdb);
        });
    } else {
      callback(realmdb);
    }
  }
};