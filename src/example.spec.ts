describe('my test', () => {
  it('should return true', () => {
    expect(true).toEqual(true);
  });
});

// feature
class FriendsList {
  friends = [];
  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }
  announceFriendship(name) {
    global.console.log(`${name} is now a friend!`);
  }
  removeFriend(name) {
    const index = this.friends.indexOf(name);
    if (index === -1) {
      throw new Error('Friend not found!');
    }
    this.friends.splice(index, 1);
  }
}

// tests
describe('FriendList', () => {
  let friendList;
  beforeEach(() => {
    friendList = new FriendsList();
  });
  it('should initializes friends list', () => {
    expect(friendList.friends.length).toEqual(0);
  });

  it('should add a friend to the list', () => {
    friendList.addFriend('Roger');
    expect(friendList.friends.length).toEqual(1);
    expect(
      friendList.friends.every(friend => typeof friend === 'string'),
    ).toEqual(true);
  });

  it('should announce friendship', () => {
    friendList.announceFriendship = jest.fn();
    expect(friendList.announceFriendship).not.toHaveBeenCalled();
    friendList.addFriend('Roger');
    expect(friendList.announceFriendship).toHaveBeenCalledWith('Roger');
    expect(friendList.announceFriendship).toHaveBeenCalledTimes(1);
  });
  describe('removeFriend', () => {
    it('should remove a friend from the list', () => {
      friendList.addFriend('Roger');
      expect(friendList.friends[friendList.friends.length - 1]).toEqual(
        'Roger',
      );
      friendList.removeFriend('Roger');
      expect(friendList[0]).toBeUndefined();
    });
    it('should throw an error as friend does not exist', () => {
      expect(() => friendList.removeFriend('Roger')).toThrowError(
        'Friend not found!',
      );
    });
  });
});
