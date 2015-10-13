class User < ActiveRecord::Base
  validates_uniqueness_of :data_id
  def clean_like
    likes = []
    if self.likes
      self.likes.each do |like|
        if !likes.to_json.include?(like.to_json)
          likes.push(like)
        end
      end
    end
    self.likes = likes
  end
  def education
    if self.schools
      self.schools.last['name']
      if self.majors
        self.schools.last['name'] + " " + self.majors.last['name']
      end
    end
  end
end
