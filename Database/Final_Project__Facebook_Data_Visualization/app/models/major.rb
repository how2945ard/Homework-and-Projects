class Major < ActiveRecord::Base
  validates_uniqueness_of :data_id
end
