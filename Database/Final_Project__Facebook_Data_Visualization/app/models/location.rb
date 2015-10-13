class Location < ActiveRecord::Base
  has_many :place,:class_name => 'Place', :foreign_key => 'location_id'
  validates_uniqueness_of :longitude, :scope => [:latitude]
end
