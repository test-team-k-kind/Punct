class PasswordResetsController < ApplicationController
  skip_before_action :require_login
  before_action :get_user
  before_action :check_token, only: [:check, :update]

  def create
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      payload = { message: 'パスワード再設定用のメールを送信しました。' }
    else
      payload = { errors: ['メールアドレスが見つかりません。'] }
    end
    render json: payload
  end

  def check
    head :no_content
  end

  def update
    if !@user&.authenticated?(:reset, params[:id])
      message = '無効なリンクです'
    end
    if params[:user][:password].empty?
      @user.errors.add(:password, :blank)
      render 'error'
    elsif @user.update(user_params)
      log_in @user
      flash[:notice] = 'パスワードが再設定されました。'
      @user.update(reset_digest: nil)
      respond_to do |format|
        format.html { redirect_to root_url }
      end
    else
      render 'error'
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def get_user
    @user = User.find_by(email: params[:email]&.downcase, provider: nil)
  end

  def check_token
    if !@user&.authenticated?(:reset, params[:token])
      message = '無効なリンクです。'
    elsif @user.password_reset_expired?
      message = 'リンクが有効期限切れです。'
    end

    render json: { error: message } if message
  end
end
