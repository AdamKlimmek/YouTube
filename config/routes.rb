Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    resource :users, only: [:create]
    resource :session, only: [:create, :destroy, :show]
    resources :videos, only: [:index, :show, :create, :update, :destroy]
  end

  root "static_pages#root"
end
