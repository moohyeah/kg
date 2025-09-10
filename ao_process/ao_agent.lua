if not ao then ao = require('ao') end
if not bint then bint = require('.bint')(256) end
if not Random then Random = require('.chance') end

local json = require('json')
local pretty = require(".pretty")

ao_agent = ao_agent or {}


local knowledge_graph_electrical = {
    nodes = {
        -- 核心节点 - 居中
        ['电学'] = {type='core', label='电学', x=50, y=50, info={title='电学', desc='物理学分支，研究电荷、电场、电路及其相互作用的规律与应用。'}},

        -- 一级节点 - 围绕核心呈圆形分布
        ['学科知识'] = {type='primary', label='学科知识', x=30, y=30, info={title='学科知识', desc='电学领域的系统性理论知识体系与基础概念。'}},
        ['研究'] = {type='primary', label='研究', x=70, y=30, info={title='研究', desc='电学领域的科学探索、实验与前沿创新活动。'}},
        ['政策'] = {type='primary', label='政策', x=70, y=70, info={title='政策', desc='与电力能源、电子产业发展相关的国家及地方性指导方针和支持措施。'}},
        ['热点'] = {type='primary', label='热点', x=30, y=70, info={title='热点', desc='当前电学领域受关注的新技术、新工具和新应用方向。'}},
        ['行业'] = {type='primary', label='行业', x=50, y=20, info={title='行业', desc='电学知识得以应用和实践的主要工业、技术与能源领域。'}},

        -- 学科知识下的二级节点
        ['电路理论'] = {type='secondary', label='电路理论', x=20, y=20, info={title='电路理论', desc='研究电流流通路径的组成、分析、计算与设计方法。'}},
        ['电磁场理论'] = {type='secondary', label='电磁场理论', x=30, y=20, info={title='电磁场理论', desc='研究电荷与电流产生的电场和磁场的性质与相互作用。'}},
        ['电子技术'] = {type='secondary', label='电子技术', x=40, y=20, info={title='电子技术', desc='研究电子器件、电路及其应用的技术，包括模拟和数字电路。'}},
        ['电力工程'] = {type='secondary', label='电力工程', x=50, y=20, info={title='电力工程', desc='研究电能的产生、传输、分配、利用及相关系统设计。'}},

        -- 电路理论下的三级节点
        ['基本电路元件'] = {type='tertiary', label='基本电路元件', x=10, y=10, info={title='基本电路元件', desc='电阻、电容、电感等无源元件及电源的特性与分析。'}},
        ['电路分析方法'] = {type='tertiary', label='电路分析方法', x=20, y=10, info={title='电路分析方法', desc='包括基尔霍夫定律、节点电压法、网孔电流法等经典分析方法。'}},
        ['交流电路'] = {type='tertiary', label='交流电路', x=30, y=10, info={title='交流电路', desc='研究正弦交流电的特性，以及电路在交流激励下的响应。'}},

        -- 电磁场理论下的三级节点
        ['静电学'] = {type='tertiary', label='静电学', x=30, y=30, info={title='静电学', desc='研究静止电荷产生的电场及其性质和高斯定理等。'}},
        ['静磁学'] = {type='tertiary', label='静磁学', x=40, y=30, info={title='静磁学', desc='研究恒定电流产生的磁场及其性质和安培环路定理等。'}},
        ['电磁波'] = {type='tertiary', label='电磁波', x=50, y=30, info={title='电磁波', desc='研究变化的电磁场在空间中传播的规律与特性。'}},

        -- 电子技术下的三级节点
        ['模拟电子技术'] = {type='tertiary', label='模拟电子技术', x=60, y=30, info={title='模拟电子技术', desc='处理连续信号的电子电路，如放大器、滤波器等。'}},
        ['数字电子技术'] = {type='tertiary', label='数字电子技术', x=70, y=30, info={title='数字电子技术', desc='处理离散信号的电子电路，如逻辑门、触发器、微处理器等。'}},
        ['半导体器件'] = {type='tertiary', label='半导体器件', x=80, y=30, info={title='半导体器件', desc='二极管、晶体管、集成电路等核心电子器件的原理与特性。'}},

        -- 电力工程下的三级节点
        ['发电工程'] = {type='tertiary', label='发电工程', x=70, y=50, info={title='发电工程', desc='火力、水力、核能、风能、太阳能等各种发电方式与技术。'}},
        ['输配电技术'] = {type='tertiary', label='输配电技术', x=80, y=50, info={title='输配电技术', desc='电能的高压传输、变电、配电到用户的整个系统与技术。'}},
        ['电机与拖动'] = {type='tertiary', label='电机与拖动', x=90, y=50, info={title='电机与拖动', desc='发电机、电动机的原理、控制及其在工业拖动中的应用。'}},

        -- 研究下的二级节点
        ['电学特性研究'] = {type='secondary', label='电学特性研究', x=70, y=60, info={title='电学特性研究', desc='研究新材料、新器件在不同条件下的导电、介电、磁学等特性。'}},
        ['电学测量技术'] = {type='secondary', label='电学测量技术', x=80, y=60, info={title='电学测量技术', desc='研究电压、电流、电阻、功率等电参数的精确测量方法与仪器。'}},

        -- 热点下的二级节点
        ['电学仿真软件'] = {type='secondary', label='电学仿真软件', x=20, y=60, info={title='电学仿真软件', desc='用于电路设计、电磁场分析的软件工具，如SPICE, MATLAB, HFSS等。'}},
        ['实验教学'] = {type='secondary', label='实验教学', x=30, y=60, info={title='实验教学', desc='电学基础实验、综合设计实验的教学方案与实验设备。'}},
        ['前沿应用'] = {type='secondary', label='前沿应用', x=40, y=60, info={title='前沿应用', desc='如物联网、智能电网、电动汽车、无线充电等新兴电学应用领域。'}},

        -- 政策下的二级节点
        ['能源政策'] = {type='secondary', label='能源政策', x=20, y=80, info={title='能源政策', desc='国家关于电力能源结构、新能源发展、节能减排的宏观政策。'}},
        ['产业政策'] = {type='secondary', label='产业政策', x=30, y=80, info={title='产业政策', desc='支持集成电路、人工智能、5G等电子信息技术产业发展的政策。'}},

        -- 行业下的二级节点
        ['电力行业'] = {type='secondary', label='电力行业', x=70, y=80, info={title='电力行业', desc='涵盖发电、输配电、供电的庞大能源工业体系。'}},
        ['电子信息产业'] = {type='secondary', label='电子信息产业', x=80, y=80, info={title='电子信息产业', desc='涵盖半导体、通信设备、计算机制造、软件等的信息技术产业。'}},
        ['电器制造业'] = {type='secondary', label='电器制造业', x=90, y=80, info={title='电器制造业', desc='生产家用电器、工业电器等各类用电设备的制造行业。'}},
    },

    connections = {
        -- 核心到一级
        {'电学', '学科知识'},
        {'电学', '研究'},
        {'电学', '政策'},
        {'电学', '热点'},
        {'电学', '行业'},

        -- 学科知识到二级
        {'学科知识', '电路理论'},
        {'学科知识', '电磁场理论'},
        {'学科知识', '电子技术'},
        {'学科知识', '电力工程'},

        -- 电路理论到三级
        {'电路理论', '基本电路元件'},
        {'电路理论', '电路分析方法'},
        {'电路理论', '交流电路'},

        -- 电磁场理论到三级
        {'电磁场理论', '静电学'},
        {'电磁场理论', '静磁学'},
        {'电磁场理论', '电磁波'},

        -- 电子技术到三级
        {'电子技术', '模拟电子技术'},
        {'电子技术', '数字电子技术'},
        {'电子技术', '半导体器件'},

        -- 电力工程到三级
        {'电力工程', '发电工程'},
        {'电力工程', '输配电技术'},
        {'电力工程', '电机与拖动'},

        -- 研究到二级
        {'研究', '电学特性研究'},
        {'研究', '电学测量技术'},

        -- 热点到二级
        {'热点', '电学仿真软件'},
        {'热点', '实验教学'},
        {'热点', '前沿应用'},

        -- 政策到二级
        {'政策', '能源政策'},
        {'政策', '产业政策'},

        -- 行业到二级
        {'行业', '电力行业'},
        {'行业', '电子信息产业'},
        {'行业', '电器制造业'},
    },
    title = "电学知识图谱",
}

local knowledge_graph_mechanics = {
    nodes = {
        ['力学'] = {type='core', label='力学', x=50, y=50, info={title='力学', desc='物理学分支，研究物体在力作用下的运动和变形。'}},
        
        -- 一级节点 - 优先绘制节点多的分支，距离根据子节点数量调整
        -- 学科知识有4个子节点，距离较远
        ['学科知识'] = {type='primary', label='学科知识', x=38, y=35, info={title='学科知识', desc='力学领域的系统性理论知识体系。'}},
        -- 热点有3个子节点，距离中等
        ['热点'] = {type='primary', label='热点', x=65, y=40, info={title='热点', desc='当前力学领域受关注的新技术、新工具和新问题。'}},
        -- 研究有2个子节点，距离较近
        ['研究'] = {type='primary', label='研究', x=70, y=70, info={title='研究', desc='力学领域的科学探索与创新活动。'}},
        -- 政策有2个子节点，距离较近
        ['政策'] = {type='primary', label='政策', x=30, y=70, info={title='政策', desc='与力学发展相关的国家及地方性指导方针和支持措施。'}},
        -- 行业有2个子节点，距离较近
        ['行业'] = {type='primary', label='行业', x=50, y=80, info={title='行业', desc='力学知识得以应用和实践的主要工业与技术领域。'}},
        
        -- 学科知识下的二级节点 - 优先绘制节点多的分支
        -- 理论力学有3个子节点，距离较远
        ['理论力学'] = {type='secondary', label='理论力学', x=15, y=15, info={title='理论力学', desc='研究物体机械运动的基本规律，是各力学分支的基础。'}},
        -- 固体力学有3个子节点，距离较远
        ['固体力学'] = {type='secondary', label='固体力学', x=35, y=18, info={title='固体力学', desc='研究可变形固体在外力作用下的应力、应变及破坏规律。'}},
        -- 工程力学有2个子节点，距离中等
        ['工程力学'] = {type='secondary', label='工程力学', x=55, y=25, info={title='工程力学', desc='将力学原理应用于解决实际工程问题的学科。'}},
        -- 生物力学有2个子节点，距离中等
        ['生物力学'] = {type='secondary', label='生物力学', x=25, y=45, info={title='生物力学', desc='应用力学原理研究生物体的结构和功能。'}},
        
        -- 理论力学下的三级节点 - 无子节点，距离较近
        ['经典力学'] = {type='tertiary', label='经典力学', x=18, y=28, info={title='经典力学', desc='以牛顿运动定律为基础，研究宏观低速物体的运动。'}},
        ['连续介质力学'] = {type='tertiary', label='连续介质力学', x=5, y=25, info={title='连续介质力学', desc='将物体看作连续介质，研究其宏观力学性质。'}},
        ['力学方法'] = {type='tertiary', label='力学方法', x=10, y=5, info={title='力学方法', desc='解决力学问题的数学分析方法，如拉格朗日法和哈密顿原理。'}},
        
        -- 固体力学下的三级节点 - 无子节点，距离较近
        ['弹性力学'] = {type='tertiary', label='弹性力学', x=22, y=5, info={title='弹性力学', desc='研究固体在外力移除后能恢复原状的应力与应变关系。'}},
        ['塑性力学'] = {type='tertiary', label='塑性力学', x=32, y=6, info={title='塑性力学', desc='研究固体在超过弹性极限后发生永久变形的行为。'}},
        ['断裂力学'] = {type='tertiary', label='断裂力学', x=43, y=7, info={title='断裂力学', desc='研究含裂纹构件的强度、裂纹扩展规律及寿命预测。'}},
        
        -- 工程力学下的三级节点 - 无子节点，距离较近
        ['结构力学'] = {type='tertiary', label='结构力学', x=55, y=10, info={title='结构力学', desc='研究工程结构（如桥梁、建筑）的强度、刚度和稳定性。'}},
        ['流体力学'] = {type='tertiary', label='流体力学', x=65, y=10, info={title='流体力学', desc='研究流体（液体和气体）的静止和运动状态下的力学规律。'}},
        
        -- 生物力学下的三级节点 - 无子节点，距离较近
        ['量子力学'] = {type='tertiary', label='量子力学', x=10, y=40, info={title='量子力学', desc='研究微观粒子运动规律的物理学理论，是现代物理学的基础。'}},
        ['生物物理力学'] = {type='tertiary', label='生物物理力学', x=15, y=50, info={title='生物物理力学', desc='在分子和细胞层面研究生命过程的力学机制。'}},
        
        -- 研究下的二级节点 - 无子节点，距离较近
        ['力学行为'] = {type='secondary', label='力学行为', x=75, y=55, info={title='力学行为', desc='研究材料在不同条件下（如加载、温度）的变形与失效响应。'}},
        ['力学分析'] = {type='secondary', label='力学分析', x=75, y=85, info={title='力学分析', desc='通过理论、实验和计算手段对力学问题进行建模、求解和验证的过程。'}},
        
        -- 热点下的二级节点 - 无子节点，距离较近
        ['力学软件'] = {type='secondary', label='力学软件', x=75, y=15, info={title='力学软件', desc='用于进行计算机辅助工程（CAE）仿真的工具，如ANSYS, ABAQUS等。'}},
        ['力学教案'] = {type='secondary', label='力学教案', x=79, y=27, info={title='力学教案', desc='教师用于课堂教学的力学课程设计方案、课件和资料。'}},
        ['力学问题'] = {type='secondary', label='力学问题', x=80, y=42, info={title='力学问题', desc='学习和研究过程中遇到的典型难题、习题和前沿科学问题。'}},
        
        -- 政策下的二级节点 - 无子节点，距离较近
        ['地方政策'] = {type='secondary', label='地方政策', x=12, y=65, info={title='地方政策', desc='省、市等地方政府出台的与科技创新、产业发展相关的力学扶持政策。'}},
        ['国家政策'] = {type='secondary', label='国家政策', x=12, y=80, info={title='国家政策', desc='国家层面制定的中长期科技规划、重大专项和人才计划等。'}},
        
        -- 行业下的二级节点 - 无子节点，距离较近
        ['工业自动化'] = {type='secondary', label='工业自动化', x=40, y=90, info={title='工业自动化', desc='涉及力学分析、机器人学、控制理论等的自动化生产和制造领域。'}},
        ['电子技术'] = {type='secondary', label='电子技术', x=60, y=90, info={title='电子技术', desc='涉及微机电系统（MEMS）、芯片封装、结构可靠性等力学相关的电子领域。'}},
    },

    connections = {
        -- 核心到一级
        {'力学', '学科知识'},
        {'力学', '研究'},
        {'力学', '政策'},
        {'力学', '热点'},
        {'力学', '行业'},

        -- 学科知识到二级
        {'学科知识', '理论力学'},
        {'学科知识', '固体力学'},
        {'学科知识', '工程力学'},
        {'学科知识', '生物力学'},

        -- 理论力学到三级
        {'理论力学', '经典力学'},
        {'理论力学', '连续介质力学'},
        {'理论力学', '力学方法'},

        -- 固体力学到三级
        {'固体力学', '弹性力学'},
        {'固体力学', '塑性力学'},
        {'固体力学', '断裂力学'},

        -- 工程力学到三级
        {'工程力学', '结构力学'},
        {'工程力学', '流体力学'},

        -- 生物力学到三级
        {'生物力学', '量子力学'},
        {'生物力学', '生物物理力学'},

        -- 研究到二级
        {'研究', '力学行为'},
        {'研究', '力学分析'},

        -- 热点到二级
        {'热点', '力学软件'},
        {'热点', '力学教案'},
        {'热点', '力学问题'},

        -- 政策到二级
        {'政策', '地方政策'},
        {'政策', '国家政策'},

        -- 行业到二级
        {'行业', '工业自动化'},
        {'行业', '电子技术'},
    },
    title = "力学知识图谱",
}

knowlage_graph = {
    mechanics = knowledge_graph_mechanics,
    electrical = knowledge_graph_electrical,
}

function ao_agent.Search(msg)
    local search = msg.Tags.Query
    assert(search, 'Text is required!')
    local graph
    local target_node
    for key, v in pairs(knowlage_graph) do
        for _, node in pairs(v.nodes) do
            if string.find(node.label, search) then
                graph = v
                target_node = node
                break
            end
        end
    end
    -- local graph = knowlage_graph[search]
    if graph then
        ao.send({
            Target = msg.From,
            Data = json.encode({graph = graph, target_node = target_node}),
        })
    else
        ao.send({
            Target = msg.From,
            Data = "{}",
        })
    end
end


Handlers.add('search', Handlers.utils.hasMatchingTag('Action', 'Search'), ao_agent.Search)
