const resolvers = {
  Query: {
    user(_parent, _args, _context) {
      return { id: '1', name: 'Bucke', wallet: 'bulldog' };
    },
    users(_parent, _args, _context) {
      return [
        { id: '1', name: 'Buck', wallet: 'bulldog' },
        { id: '2', name: 'Bucker', wallet: 'dog' },
      ];
    },
  },
};

export default resolvers;
