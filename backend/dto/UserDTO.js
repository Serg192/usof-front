class UserDTO {
  user_login;
  user_role;
  user_rating;
  user_profile_picture;

  constructor(user) {
    const { user_login, user_role, user_rating, user_profile_picture } = user;
    this.user_login = user_login;
    this.user_role = user_role;
    this.user_rating = user_rating;
    this.user_profile_picture = user_profile_picture;
  }
}

module.exports = UserDTO;
