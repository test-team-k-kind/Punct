Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resource :auth, only: [:create, :destroy], controller: 'auth' do
      get :name, on: :collection
    end
    resources :tasks, only: [:index, :create, :update, :destroy]
    resource :user, only: [:show]
  end
end
