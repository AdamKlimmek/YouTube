class Api::SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token
    
    def create
        @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

        if @user
            login(@user)
            render :show
        else
            render json: ['Invalid email/password'], status: 401
        end
    end

    def destroy
        if current_user
            logout
            render json: {}
        else
            render json: ['No user is signed in'], status: 404
        end
    end

end
