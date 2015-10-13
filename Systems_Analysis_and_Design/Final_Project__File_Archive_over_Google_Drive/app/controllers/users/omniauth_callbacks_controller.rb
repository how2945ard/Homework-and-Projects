class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_filter :verify_authenticity_token

  def google_oauth2
      @user = User.from_omniauth(request.env["omniauth.auth"])

      session[:access_token_google_oauth2] = request.env["omniauth.auth"].credentials.token
      
      if @user.persisted?
        flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
        sign_in_and_redirect @user, :event => :authentication
      else
        session["devise.google_data"] = request.env["omniauth.auth"]
        redirect_to new_user_registration_url
      end
  end
  
end
