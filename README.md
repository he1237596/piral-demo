# piral-demo

设置工具
Piral 附带了一个名为 的强大命令行工具piral-cli。支持piral-cli开发人员执行最重要的任务，可以使用以下命令进行安装：
```shell
# Install the Piral CLI
npm i piral-cli -g
# Check version of the Piral CLI
piral --version
```

### 设置新的 Piral 实例
- 可以使用 创建 Piral 实例piral-cli。要构建一个基于 Piral 的新应用程序 shell，其名称my-app请在终端窗口中执行以下命令：

```shell
piral new my-app
```
- 使用 npm 初始化器设置新的 Piral 实例
```shell
# 如果您不想全局安装 Piral CLI，您还可以利用此命令的 npm 初始化程序。
# 在npm v6中你可以这样写：
npm init piral-instance --target my-app --defaults
# 在npm v7、npm v8及更高版本中，您可以编写：
npm init piral-instance -- --target my-app --defaults
```
### 启动 Piral实例
```shell
# Start the Piral instance in debug mode
npx piral debug
```

### 使用 Piral CLI 创建 Pilet
Pilet 是一个模块，它实现功能并可以动态加载到基于 Piral 的应用程序 shell 中。
- 创建桩:Piral 工具还支持搭建桩以开始使用。确保您不再位于应用程序 shell 的目录中并运行以下命令：
```shell
pilet new ./my-app/dist/emulator/my-app-1.0.0.tgz --target my-pilet
```
- 您还可以利用 npm 初始化程序来创建新的pilets。
```shell
# 在npm v6中你可以这样写：
npm init pilet --target my-pilet --source ./my-app/dist/emulator/my-app-1.0.0.tgz --defaults
# 在npm v7、npm v8及更高版本中，您可以编写：
npm init pilet -- --target my-pilet --source ./my-app/dist/emulator/my-app-1.0.0.tgz --defaults
```
### 启动 Pilet应用
```shell
# Start a Pilet in debug mode
npx pilet debug
```