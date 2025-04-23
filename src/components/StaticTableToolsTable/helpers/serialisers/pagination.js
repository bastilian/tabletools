export const paginationSerialiser = (state) => {
  if (state) {
    const offset = (state.page - 1) * state.perPage;
    const limit = state.perPage;

    return { offset, limit };
  }
};

export default paginationSerialiser;
