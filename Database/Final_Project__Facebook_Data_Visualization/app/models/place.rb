class Place < ActiveRecord::Base
  belongs_to :location, :class_name => 'Location', :foreign_key => 'location_id'
  validates_uniqueness_of :data_id
end
