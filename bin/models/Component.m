function [lngammak,Groupnumbk,Qk,rk,qk] = Component(T,mixture_params,Unifac_GC)
%Component calculates group activity coefficients for pure mixture, returns
%the group number of each group, and the van der waals volume and surface
%area.  Also surface area constants for each group
%Written by Jacob Backhaus

%  T - Temperature [K]
%  mixture_params - information on the number of groups in each component
%  and which unifac groups are present
%  Unifac_GC - Unifac interaction parameters and group surface area and
%  group volume information

% outputs:
%  lngammak - the residual activity coefficients for each
%  group in a mixture only of that group
%  Groupnumbk - index for interaction parameters used later in the UNIFAC
%  calculation
%  Qk - group surface area for each component
%  rk - Van der Waals volume for each group
%  qk - Van der Waals surface area

%Unbundle unifac components
Unifac_groups=Unifac_GC{1};
Unifac_group_vals=Unifac_GC{2};
Unifac_interaction=Unifac_GC{3};

%unbundle unifac groups from properties of the mixture
groups=mixture_params{1};
groupfreq=mixture_params{2};

n_cmpts=length(groups); %number of components that need values calculated

for i=n_cmpts:-1:1
numgroup=groupfreq{i}; %unpacks the number of each group from a cell array (v_k^(i))
group=length(numgroup); %number of groups in individual components for calculation 
index=zeros(group,1); %set vector to zeros to save computation
groupnames=groups{i}; %names of each group in component

%finds reference corresponding to group name, so other parameters can be
%found
for j=1:group;
index(j)=find(strcmp(groupnames(j),Unifac_groups));
end

Groupnumb=Unifac_group_vals(index,1); %group# of component (used in interaction parameters
R=Unifac_group_vals(index,2); %group volume constants
Q=Unifac_group_vals(index,3); %group surface area constants
r=numgroup.'*R; %Van der Waals volume
q=numgroup.'*Q; %Van der Waals surface area

% r=sum(numgroup.*R); %Van der Waals volume
% q=sum(numgroup.*Q); %Van der Waals surface area

a=Unifac_interaction(Groupnumb,Groupnumb); %group interaction parameters
PSI=exp(-a/T);

X=numgroup./(sum(numgroup)); %group fraction for pure component
theta=(Q.*X)/sum(Q.*X); %group surface area fraction for pure component
term1=PSI.'*theta; %term1 for the group activity coefficient 
thetan=repmat(theta,1,group);
term2t=thetan.'.*PSI; %top of term 2 for group activity coefficient
term2=term2t*(1./term1); %term 2 for group activity coefficient
lngamma=Q.*(1-log(term1)-term2); %group activity coefficient

%copied values for later use 
lngammak{i}=lngamma.';
Qk{i}=Q.';
qk{i}=q;
rk{i}=r;
Groupnumbk{i}=Groupnumb.';
end

end

