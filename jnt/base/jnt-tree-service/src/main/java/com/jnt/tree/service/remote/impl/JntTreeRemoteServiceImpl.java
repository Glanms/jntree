package com.jnt.tree.service.remote.impl;

import com.jnt.tree.consts.DalConstants;
import com.jnt.tree.core.JntTree;
import com.jnt.tree.core.JntTreeDTO;
import com.jnt.tree.core.JntTreeInfo;
import com.jnt.tree.core.JntTreeNode;
import com.jnt.tree.service.JntTreeInfoService;
import com.jnt.tree.service.JntTreeNodeService;
import com.jnt.tree.service.JntTreeService;
import com.jnt.tree.service.remote.JntTreeRemoteService;
import org.apache.commons.collections.CollectionUtils;
import org.oasisopen.sca.annotation.Service;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: kangyang1
 * Date: 14-8-4
 * Time: 下午4:10
 * To change this template use File | Settings | File Templates.
 */
@Service(JntTreeRemoteService.class)
@Component("JntTreeRemoteService")
public class JntTreeRemoteServiceImpl implements JntTreeRemoteService {


    private JntTreeService<JntTree> jntTreeService;
    private JntTreeInfoService<JntTreeInfo> jntTreeInfoService;
    private JntTreeNodeService<JntTreeNode> jntTreeNodeService;

    @Resource(name = "jntTreeService")
    public void setJntTreeService(JntTreeService jntTreeService) {
        this.jntTreeService = jntTreeService;
    }

    @Resource(name = "jntTreeInfoService")
    public void setJntTreeInfoService(JntTreeInfoService jntTreeInfoService) {
        this.jntTreeInfoService = jntTreeInfoService;
    }

    @Resource(name = "jntTreeNodeService")
    public void setJntTreeNodeService(JntTreeNodeService jntTreeNodeService) {
        this.jntTreeNodeService = jntTreeNodeService;
    }

    @Override
    public JntTreeDTO getJntTree(Long id) {
        JntTreeDTO jntTreeDTO = new JntTreeDTO();
        JntTree jntTree = null;
        try {
            jntTree = (JntTree) jntTreeService.getEntity(id);
            if (null != jntTree) {
                List<JntTreeInfo> jntTreeInfos = jntTreeInfoService.getJntTreeInfoByTreeId(id);
                //装配TreeInfo
                Set<Long> nodeIdSet = new HashSet<Long>();
                Map<Long, String> nodeMap = new HashMap<Long, String>();
                Map<Long, JntTreeInfo> jntTreeInfoMap = new HashMap<Long, JntTreeInfo>();

                //第一步： 装配所有的节点信息
                for (JntTreeInfo jntTreeInfo : jntTreeInfos) {
                    nodeIdSet.add(jntTreeInfo.getNodeId());
                    jntTreeInfoMap.put(jntTreeInfo.getNodeId(),jntTreeInfo);
                }
                if (CollectionUtils.isNotEmpty(nodeIdSet)) {
                    List<Long> nodeIdLs = new ArrayList<Long>();
                    nodeIdLs.addAll(nodeIdSet);
                    List<JntTreeNode> jntTreeNodes = jntTreeNodeService.getObjectList(nodeIdLs);
                    for (JntTreeNode jntTreeNode : jntTreeNodes) {
                        nodeMap.put(jntTreeNode.getId(), jntTreeNode.getName());
                    }
                }
                //第二步：具体装配JntTree，反相装配
                for (JntTreeInfo jntTreeInfo : jntTreeInfos) {
                    jntTreeInfo.setNodeName(nodeMap.get(jntTreeInfo.getNodeId()));
                    Long parentId = jntTreeInfo.getParentId();
                    //设置树的根节点
                    if(parentId.equals(DalConstants.rootParentId)){
                        jntTreeDTO.setBaseJntTreeInfo(jntTreeInfo);
                    }
                    else{
                        JntTreeInfo parentJnt = jntTreeInfoMap.get(parentId);
                        parentJnt.setChild(jntTreeInfo);
                    }
                }
            }
            jntTreeDTO.setJntTree(jntTree);


        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
        return jntTreeDTO;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
