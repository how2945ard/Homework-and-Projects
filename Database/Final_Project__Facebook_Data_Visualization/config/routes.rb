Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'home#home'
  get '/place' => 'home#map'
  get '/like' => 'home#like'
  get '/event' => 'home#event'
  get '/places' => 'home#map'
  get '/likes' => 'home#like'
  get '/events' => 'home#event'
  get '/access_token' => 'crawler#get_access_token'
  get '/auth' => 'crawler#auth'
  get '/logout' => 'home#logout'

  scope :api do
    scope :all do
      # get '/locations' => 'home#locations'
      get '/places' => 'home#all_places'
      get '/likes' => 'home#all_likes'
      get '/events' => 'home#all_events'
    end
    get '/user/:id' => 'home#user'
    get '/get_current_user' => 'home#current_user_id'
    get '/locations' => 'home#locations'
    get '/places/:id' => 'home#places'
    get '/likes/:id' => 'home#likes'
    get '/users' => 'home#users'
    get '/events/:id' => 'home#events'
  end
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
