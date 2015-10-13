Rails.application.routes.draw do

  get 'user/:t_id' => 'user#show',as: :user_show
  
  get 'folder/new(/:f_id)' => 'folder#new',as: :folder_new

  get 'user/:t_id/:f_id' => 'folder#show'

  get 'file/new/:user_id/:f_id' => 'file_record#new',as: :file_new

  get 'folder/edit/:f_id' => 'folder#edit',as: :folder_edit
  
  patch 'folder/update/:f_id' => 'folder#update',as: :folder_update

  delete 'folder/destroy/:f_id' => 'folder#destroy',as: :folder_destroy

  post 'folder/create(/:f_id)' => 'folder#create',as: :folder_create

  post 'file/create(/:f_id)' => 'file_record#create',as: :file_create

  get 'user/:t_id/:f_id/file/:file_id' => 'file_record#show'

  # post 'user/:t_id/:f_id/file/:file_id/archive' => 'file_record#archive'

  delete 'user/:t_id/:f_id/file/:file_id/destroy' => 'file_record#destroy'

  post 'user/:t_id/:f_id/status/:status' => 'folder#change_status',as: :folder_change_status

  post 'user/:t_id/:f_id/file/:file_id/status/:status' => 'file_record#change_status',as: :file_record_change_status

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  root to: "home#index"

  match '*not_found', to: "home#index",via: [:*]

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

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
