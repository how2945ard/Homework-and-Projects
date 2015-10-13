class UserFriends < ActiveRecord::Migration
  def change
  	add_column :users, :friends, :json
  end
end
