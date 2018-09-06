import { BUNDLE_BASIC, BUNDLE_MEDIA, BUNDLE_DETAILS, BUNDLE_PAYMENTS, BUNDLE_FLUSH } from '../constants';
export default function reducer(state = { }, action) {
  switch (action.type) {
  case BUNDLE_BASIC:
    return { ...state, 
      title: action.payload.title, 
      description: action.payload.description,
      regStart: action.payload.regStart,
      regEnd: action.payload.regEnd,
      eventDate: action.payload.eventDate,
      location: action.payload.location,
    };
  case BUNDLE_MEDIA:
    return { ...state, 
      eventFile: action.payload.eventFile,
      category: action.payload.category,
      tags: action.payload.tags,
    };
  case BUNDLE_DETAILS:
    return { ...state, 
      c1_name: action.payload.c1_name,
      c1_phone: action.payload.c1_phone,
      c2_name: action.payload.c2_name,
      c2_phone: action.payload.c2_phone,
      faq: action.payload.faq
    };
  case BUNDLE_PAYMENTS:
    return { ...state, 
      price: action.payload.price,
      seats: action.payload.seats,
    };
  case BUNDLE_FLUSH:
    return {};
  default:
    return state;
  }
}