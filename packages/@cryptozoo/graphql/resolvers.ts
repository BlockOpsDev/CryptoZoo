export const resolvers = {
  Query: {
    user(_parent, _args, _context) {
      const func = async () => {
        const query = new _context.Moralis.Query('BSCHybridHatched');
        const results = await query.find();
        return { id: '1', name: 'Buck', wallet: JSON.stringify(results) };
      };
      return func();
    },
    users(_parent, _args, _context) {
      return [
        { id: '1', name: 'Buck', wallet: 'bulldog' },
        { id: '2', name: 'Bucker', wallet: 'dog' },
      ];
    },
  },
};
