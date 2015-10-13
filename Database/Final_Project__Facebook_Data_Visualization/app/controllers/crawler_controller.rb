require 'rest-more'
require 'net/http'
class CrawlerController < ApplicationController
  def get_access_token
    if Rails.env.development?
      # app_id = '718004254957012'
      # secret = '90c8fab3937966611b07e751ae6d6aa4'
      app_id = '717959514961486'
      secret =  'e9e7630ba3c7ba9138212ef6bfd236cb'
      redirect_uri = 'http://localhost:3000/auth'
    elsif Rails.env.production?
      app_id = '717959514961486'
      secret =  'e9e7630ba3c7ba9138212ef6bfd236cb'
      redirect_uri = 'http://db-project.herokuapp.com/auth'
    end
    f = RC::Facebook.new :app_id => app_id,
      :secret => secret,
      :log_method => method(:puts)
    scope = 'public_profile, user_friends, user_likes, user_status, user_tagged_places,user_events,user_hometown,user_education_history,user_location'
    # Redirect the user to:
    redirect_to f.authorize_url(:redirect_uri => redirect_uri, :scope => scope)
  end
  def auth
    if Rails.env.development?
      # app_id = '718004254957012'
      # secret = '90c8fab3937966611b07e751ae6d6aa4'
      app_id = '717959514961486'
      secret =  'e9e7630ba3c7ba9138212ef6bfd236cb'
      redirect_uri = 'http://localhost:3000/auth'
    elsif Rails.env.production?
      app_id = '717959514961486'
      secret =  'e9e7630ba3c7ba9138212ef6bfd236cb'
      redirect_uri = 'http://db-project.herokuapp.com/auth'
    end
    f = RC::Facebook.new :app_id => app_id,
      :secret => secret,
      :log_method => method(:puts)
    f.authorize!(:redirect_uri => redirect_uri, :code => params[:code])
    raw_data = f.get(URI.encode('me?fields=friends.limit(500){picture.width(1000),name,location,education,hometown},name,education,hometown,location,picture.width(1000)'))
    current_user = get_user(raw_data)
    Thread.new do
      raw_data = f.get(URI.encode('me/likes?limit=500'))
      get_data_from_likes(raw_data,current_user)
      current_user.clean_like
      current_user.save
      ActiveRecord::Base.connection.close
    end
    Thread.new do
      raw_data = f.get(URI.encode('me/statuses?fields=tags.limit(500){pic,name,id},place,message&limit=500'))
      get_place_from_status(raw_data,current_user)
      raw_data = f.get(URI.encode('me/tagged_places?field=place&limit=500'))
      get_place_from_tagged_places(raw_data,current_user)
      current_user.save
      ActiveRecord::Base.connection.close
    end
    Thread.new do
      raw_data = f.get(URI.encode('me/events?fields=attending_count,description,name,id,cover&since=631152000&limit=500'))
      get_event_from_events(raw_data,current_user)
      current_user.save
      ActiveRecord::Base.connection.close
    end
    redirect_to '/'
  end

  private
  def get_event_data event_data,current_user
    event = Event.find_or_create_by(data_id: event_data['id'].to_i)
    event.location =  event_data['location']
    event.attending_count =  event_data['attending_count'].to_i
    event.description =  event_data['description']
    if(event_data['cover'])
      event.cover =  event_data['cover']['source']
    end
    event.name =  event_data['name']
    event.start_time =  event_data['start_time']
    if(event.participant==nil)
      event.participant = []
    end
    current_user_json = {
      id: current_user.id,
      user: {
        pic: current_user.pic,
        name: current_user.name
      }
    }
    if !event.participant.to_json.include?('"id":'+current_user.id.to_s+',')
      event.participant.push(current_user_json)
    end
    if(current_user.events==nil)
      current_user.events = []
    end
    event_json = {
      id: event.id,
      event: {
        name: event.name,
        description: event.description,
        cover: event.cover,
        start_time: event.start_time,
        location: event.location,
        attending_count: event.attending_count
      }
    }
    if !current_user.events.to_json.include?('"id":'+event.id.to_s+',')
      current_user.events.push(event_json)
    end
    event.participant = event.participant.to_json
    current_user.events = current_user.events.to_json
    event.save
  end
  def get_user_as_friends raw_data
    user = User.find_or_create_by(data_id: raw_data['id'].to_i)
    user.name = raw_data['name']
    if raw_data['hometown']
      user.hometown = raw_data['hometown']['name']
    end
    if raw_data['location']
      user.location = raw_data['location']['name']
    end
    if raw_data['picture']
      user.pic = raw_data['picture']['data']['url']
    end
    if raw_data['education']
      raw_data['education'].each do |education|
        school = School.find_or_create_by(data_id: education['school']['id'].to_i)
        school.data_id = education['school']['id'].to_i
        school.name = education['school']['name']
        school.school_type = education['type']
        user_json = {
          id: user.id,
          user: {
            pic: user.pic,
            name: user.name
          }
        }
        if education['concentration']
          education['concentration'].each do | major_data |
            major = Major.find_or_create_by(data_id: major_data["id"].to_i)
            major.name = major_data["name"]
            major_json = {
              id: major.id,
              name: major.name
            }
            if major.students == nil
              major.students =[]
            end
            if !major.students.to_json.include?('"id":'+user.id.to_s+',')
              major.students.push(user_json)
            end
            if user.majors == nil
              user.majors =[]
            end
            if !user.majors.to_json.include?('"id":'+major.id.to_s+',')
              user.majors.push(major_json)
            end
            if school.majors == nil
              school.majors =[]
            end
            if !school.majors.to_json.include?('"id":'+major.id.to_s+',')
              school.majors.push(major_json)
            end
            major.students = major.students.to_json
            major.save
          end
        end
        if user.schools ==nil
          user.schools =[]
        end
        education_json={
          id: school.id,
          name: school.name,
          type: school.school_type
        }
        if !user.schools.to_json.include?('"id":'+school.id.to_s+',')
          user.schools.push(education_json)
        end
        if school.students == nil
          school.students = []
        end
        if !school.students.to_json.include?('"id":'+user.id.to_s+',')
          school.students.push(user_json)
        end
        school.students = school.students.to_json
        school.majors = school.majors.to_json
        school.save
      end
    end
    user.schools = user.schools.to_json
    user.majors = user.majors.to_json
    user.save
    user
  end
  def get_user raw_data
    user = User.find_or_create_by(data_id: raw_data['id'].to_i)
    user.name = raw_data['name']
    if raw_data['hometown']
      user.hometown = raw_data['hometown']['name']
    end
    if raw_data['location']
      user.location = raw_data['location']['name']
    end
    if raw_data['picture']
      user.pic = raw_data['picture']['data']['url']
    end
    if raw_data['friends'] && raw_data['friends']['data']
      friend_data = raw_data['friends']
      get_friends(friend_data['data'],user)
      while friend_data&&friend_data['paging']&&friend_data['paging']['next']
        friend_data = ActiveSupport::JSON.decode Net::HTTP.get(URI.parse(friend_data['paging']['next']))
        get_friends(friend_data['data'],user)
      end
    end
    if raw_data['education']
      raw_data['education'].each do |education|
        school = School.find_or_create_by(data_id: education['school']['id'].to_i)
        school.data_id = education['school']['id'].to_i
        school.name = education['school']['name']
        school.school_type = education['type']
        user_json = {
          id: user.id,
          user: {
            pic: user.pic,
            name: user.name
          }
        }
        if education['concentration']
          education['concentration'].each do | major_data |
            major = Major.find_or_create_by(data_id: major_data["id"].to_i)
            major.name = major_data["name"]
            major_json = {
              id: major.id,
              name: major.name
            }
            if major.students == nil
              major.students =[]
            end
            if !major.students.to_json.include?('"id":'+user.id.to_s+',')
              major.students.push(user_json)
            end
            if user.majors == nil
              user.majors =[]
            end
            if !user.majors.to_json.include?('"id":'+major.id.to_s+',')
              user.majors.push(major_json)
            end
            if school.majors == nil
              school.majors =[]
            end
            if !school.majors.to_json.include?('"id":'+major.id.to_s+',')
              school.majors.push(major_json)
            end
            major.students = major.students.to_json
            major.save
          end
        end
        if user.schools ==nil
          user.schools =[]
        end
        education_json={
          id: school.id,
          name: school.name,
          type: school.school_type
        }
        if !user.schools.to_json.include?('"id":'+school.id.to_s+',')
          user.schools.push(education_json)
        end
        if school.students == nil
          school.students = []
        end
        if !school.students.to_json.include?('"id":'+user.id.to_s+',')
          school.students.push(user_json)
        end
        school.students = school.students.to_json
        school.majors = school.majors.to_json
        school.save
      end
    end
    user.schools = user.schools.to_json
    user.majors = user.majors.to_json
    user.save
    session[:current_user_id] = user.id
    user
  end
  def get_friends(data,user)
    if user.friends == nil
      user.friends = []
    end
    user_json = {
      id: user.id,
      user: {
        pic: user.pic,
        name: user.name
      }
    }
    data.each do |friend|
      friend_obj = get_user_as_friends(friend)
      if friend_obj.friends == nil
        friend_obj.friends = []
      end
      friend_json = {
        id: friend_obj.id,
        user: {
          pic: friend_obj.pic,
          name: friend_obj.name
        }
      }
      if !user.friends.to_json.include?('"id":'+friend_obj.id.to_s+',')
        user.friends.push(friend_json)
        user.save
      end
      if !friend_obj.friends.to_json.include?('"id":'+user.id.to_s+',')
        friend_obj.friends.push(user_json)
        friend_obj.save
      end
    end
    user.save
  end
  def get_data_from_place_object(data,current_user)
    place = Place.find_or_create_by(data_id: data['place']['id'].to_i)
    place.data_id = data['place']['id'].to_i
    place.name = (data['place']['name'] == nil)? place.name : data['place']['name']
    place.updated_time = (data['updated_time'] == nil)? place.updated_time : data['updated_time']
    place.message = (data['message'] == nil)? place.message : data['message']
    conditions = { :latitude => data['place']['location']['latitude'],
                   :longitude => data['place']['location']['longitude']
                   }
    location = Location.where(conditions).first_or_create
    location.city = data['place']['location']['city']
    location.country = data['place']['location']['country']
    location.latitude = data['place']['location']['latitude']
    location.longitude = data['place']['location']['longitude']
    location.street = data['place']['location']['street']
    location.zip = data['place']['location']['zip']
    location.save
    if(place.tagged_user==nil)
      place.tagged_user = []
    end
    if( current_user.been_to==nil)
      current_user.been_to = []
    end
    place_json = {
      id: place.id,
      place: {
        name: place.name,
        message: place.message,
        latitude: location.latitude,
        longitude: location.longitude
      }
    }
    if !current_user.been_to.to_json.include?('"id":'+place.id.to_s+',')
      current_user.been_to.push(place_json)
    end
    current_user_json = {
      id: current_user.id,
      user: {
        pic: current_user.pic,
        name: current_user.name
      }
    }
    if !place.tagged_user.to_json.include?('"id":'+current_user.id.to_s+',')
      place.tagged_user.push(current_user_json)
    end
    if data['tags'] != nil
      data['tags']['data'].each do |tag|
        user = User.find_or_create_by(data_id: tag['id'].to_i)
        user.pic = tag['pic']
        user.name = tag['name']
        if(user.been_to==nil)
          user.been_to = []
        end
        if !user.been_to.to_json.include?('"id":'+place.id.to_s+',')
          user.been_to.push(place_json)
        end
        user_json = {
          id: user.id,
          user: {
            pic: user.pic,
            name: user.name
          }
        }
        if !place.tagged_user.to_json.include?('"id":'+user.id.to_s+',')
          place.tagged_user.push(user_json)
        end
        user.been_to = user.been_to.to_json
        user.save
      end
    end
    place.location_id = location.id
    current_user.been_to = current_user.been_to.to_json
    place.tagged_user = place.tagged_user.to_json
    place.save
  end
  def paring_likes(data,current_user)
    like = Like.find_or_create_by(data_id: data['id'].to_i,name:data['name'])
    like.category = data['category']
    like.name = data['name']
    like.created_time = data['created_time']
    like.data_id = data['id'].to_i
    if (current_user.likes == nil)
      current_user.likes = []
    end
    like_json = {
      id: like.id,
      like: {
        name: like.name
      }
    }
    if !current_user.likes.to_json.include?('"id":'+like.id.to_s+',')
      current_user.likes.push(like_json)
      current_user.likes = current_user.likes.to_json
    end
    if (like.liker ==nil)
      like.liker = []
    end
    current_user_json ={
      id: current_user.id,
      user: {
        pic: current_user.pic,
        name: current_user.name
      }
    }
    if !like.liker.to_json.include?('"id":'+current_user.id.to_s+',')
      like.liker.push(current_user_json)
      like.liker = like.liker.to_json
    end
    like.save
  end

  def get_place_from_tagged_places(raw_data,current_user)
    raw_data['data'].each do | data |
      if(data['place'])
        get_data_from_place_object(data, current_user)
      end
    end
    if( raw_data['paging'] && raw_data['paging']['next'] )
      raw_data = ActiveSupport::JSON.decode Net::HTTP.get(URI.parse(raw_data['paging']['next']))
      get_place_from_tagged_places(raw_data,current_user)
    end
  end
  def get_event_from_events(raw_data,current_user)
    raw_data['data'].each do | data |
      get_event_data(data, current_user)
    end
    if( raw_data['paging'] && raw_data['paging']['next'] )
      raw_data = ActiveSupport::JSON.decode Net::HTTP.get(URI.parse(raw_data['paging']['next']))
      get_event_data(raw_data,current_user)
    end
  end

  def get_place_from_status(raw_data,current_user)
    raw_data['data'].each do | data |
      if(data['place'])
        get_data_from_place_object(data,current_user)
      end
    end
    if( raw_data['paging'] && raw_data['paging']['next'] )
      raw_data = ActiveSupport::JSON.decode Net::HTTP.get(URI.parse(raw_data['paging']['next']))
      get_place_from_status(raw_data,current_user)
    end
  end

  def get_data_from_likes(raw_data,current_user)
    raw_data['data'].each do | data |
      paring_likes(data,current_user)
    end
    if( raw_data['paging'] && raw_data['paging']['next'] )
      raw_data = ActiveSupport::JSON.decode Net::HTTP.get(URI.parse(raw_data['paging']['next']))
      get_data_from_likes(raw_data,current_user)
    end
  end

end
