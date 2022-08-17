export const INITIAL_STATE = {
  betName: '',
  firstOption: '',
  secondOption: '',
  imageUrl: null,
};

export const formReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_FORM':
      return INITIAL_STATE;
    case 'UPDATE_FORM':
      return {
        ...state,
        [action.data.name]: action.data.value,
      };
    default:
      return state;
  }
};
