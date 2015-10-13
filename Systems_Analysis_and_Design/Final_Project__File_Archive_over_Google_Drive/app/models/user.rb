class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  #  :recoverable, :confirmable,:lockable,
  devise :database_authenticatable, 
         :trackable, :rememberable, :validatable, :omniauthable, :omniauth_providers => [:google_oauth2]

  has_many :folders, :dependent => :destroy
  has_many :file_records, :dependent => :destroy

  def self.from_omniauth(access_token)
      data = access_token.info
      user = User.where(:email => data["email"]).first
      if user
        user.access_token = access_token.credentials.token
        user.refresh_token = access_token.credentials.refresh_token
        user.expires_at = Time.at(access_token.credentials.expires_at)
        user.save
      else
          user = User.create(name: data["name"],
             email: data["email"],
             password: Devise.friendly_token[0,20],
             access_token: access_token.credentials.token,
             refresh_token: access_token.credentials.access_token,
             expires_at: Time.at(access_token.credentials.expires_at),
             provider: access_token['provider'],
             uid: access_token['uid']
          )
      end
      user
  end

  def refresh_token_if_expired
    if token_expired?
      response    = RestClient.post "#{ENV['DOMAIN']}oauth2/token", :grant_type => 'refresh_token', :refresh_token => self.refresh_token, :client_id => ENV['APP_ID'], :client_secret => ENV['APP_SECRET'] 
      refreshhash = JSON.parse(response.body)
      puts refreshhash["expires_in"]

      self.access_token     = refreshhash['access_token']
      self.expires_at = DateTime.now + refreshhash["expires_in"].to_i.seconds

      self.save
    end
  end

  def token_expired?
    expiry = self.expires_at
    return true if expiry < Time.now.utc # expired token, so we should quickly return
    token_expires_at = expiry
    save if changed?
    false # token not expired. :D
  end

  def archive file_id
    file = FileRecord.where(:id=>file_id).first
    f_id = file.parent_folder_id
    self.refresh_token_if_expired
    session = GoogleDrive.login_with_oauth(access_token)

    if file.parent_folder_id
      stack = []
      cur = file.parent_folder
      stack.push(cur.name)
      root = session.root_collection
      while cur && cur.parent_folder_id
        cur = cur.parent_folder
        stack.push(cur.name)
      end
      cur_folder = root
      while !stack.blank?
        cur = stack.pop()
        sub = cur_folder.subcollection_by_title(cur)
        if sub
          cur_folder = sub
        else
          cur_folder = cur_folder.create_subcollection(cur)
        end
      end
    end

    file.last_archived = Time.now()

    session.upload_from_file("public/uploads/#{file.file_obj}", file.google_drive_file_name, convert: false)
    file_on_google_drive = root.file_by_title(file.google_drive_file_name)
    cur_folder.add(file_on_google_drive)
    root.remove(file_on_google_drive)

    current_folder = Folder.where(:id=>f_id,:user_id=>id).first
    if current_folder
      file.parent_folder_id = current_folder.id
      if current_folder.user
        file.receiver_id = current_folder.user.id
      end
    end
    # back_path ||= root_path
    # flash[:success] = "Success"
    file.save

    # redirect_to back_path
  end
end
