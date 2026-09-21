
variable "lambda_memory" {
  default = "128"
}
variable "lambda_runtime" {
  default = "python3.12"
}
variable "lambda_timeout" {
  default = "100"
}
variable "lambda_tracing_config" {
  default = "Active"
}
variable "region" {
  default = "us-east-2"
}
variable "workshop_stack_base_name" {
  type = string
  default = "ws-serverless-patterns"
}
variable "user_pool_admin_group_name" {
  default = "apiAdmins"
}