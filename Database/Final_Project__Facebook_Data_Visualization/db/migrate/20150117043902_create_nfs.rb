class CreateNfs < ActiveRecord::Migration
	def change
		create_table :user_beento do |t|
		  t.integer :user
		  t.integer :beento
		end
		create_table :user_likes do |t|
		  t.integer :user
		  t.integer :likes
		end
		create_table :user_event do |t|
		  t.integer :user
		  t.integer :event
		end
		create_table :user_education do |t|
		  t.integer :user
		  t.integer :education
		end
		create_table :education do |t|
		  t.integer :education_id
		  t.integer :school
		  t.integer :major
		end
	end
end
